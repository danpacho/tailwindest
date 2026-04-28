export class DependencyGraph {
    private readonly forward = new Map<string, Set<string>>()
    private readonly reverse = new Map<string, Set<string>>()

    public addEdge(consumer: string, dependency: string): void {
        if (consumer === dependency) {
            return
        }

        if (!this.forward.has(consumer)) {
            this.forward.set(consumer, new Set())
        }
        if (!this.reverse.has(dependency)) {
            this.reverse.set(dependency, new Set())
        }

        this.forward.get(consumer)?.add(dependency)
        this.reverse.get(dependency)?.add(consumer)
    }

    public clearConsumer(consumer: string): void {
        const dependencies = this.forward.get(consumer)
        if (!dependencies) {
            return
        }

        for (const dependency of dependencies) {
            const consumers = this.reverse.get(dependency)
            consumers?.delete(consumer)
            if (consumers?.size === 0) {
                this.reverse.delete(dependency)
            }
        }

        this.forward.delete(consumer)
    }

    public getDependencies(consumer: string): string[] {
        return [...(this.forward.get(consumer) ?? [])]
    }

    public getReverseDependencies(dependency: string): string[] {
        return [...(this.reverse.get(dependency) ?? [])].sort()
    }
}

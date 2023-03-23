import { Tab, Tabs } from "nextra-theme-docs"

const Example = ({
    code,
    fileName,
    component,
}: {
    fileName: string
    code: string
    component: React.ReactNode
}) => {
    return (
        <Tabs items={[fileName, "result"]}>
            <Tab>
                <code
                    dangerouslySetInnerHTML={{
                        __html: code,
                    }}
                />
            </Tab>
            <Tab>{component}</Tab>
        </Tabs>
    )
}

export { Example }

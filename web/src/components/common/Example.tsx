import { Tabs, TabItem } from "@astrojs/starlight/components"

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
        <Tabs>
            <TabItem label={fileName}>
                <code
                    dangerouslySetInnerHTML={{
                        __html: code,
                    }}
                />
            </TabItem>
            <TabItem label="result">{component}</TabItem>
        </Tabs>
    )
}

export { Example }
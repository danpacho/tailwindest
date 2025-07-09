const Divider = ({ id }: { id?: string }) => {
    return (
        <div
            id={id}
            className="mx-auto w-7 h-0.5 bg-transparent md:bg-amber-100/10 my-10 md:my-20"
        />
    )
}

export { Divider }

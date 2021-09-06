const SomethingWentWrong = () => (
    <div className="px-0 laptop:px-14 min-h-screen">
        <h1 className="text-2xl laptop:text-4xl">Something went wrong.</h1>
        <br />
        <span className="text-subtle">
            An unknown error has occured. I'll take care of this problem soonest.
        </span>
        {/* <style jsx>
            {`
                .container {
                    padding: 0 50px;
                }
            `}
        </style> */}
    </div>
);

export default SomethingWentWrong;


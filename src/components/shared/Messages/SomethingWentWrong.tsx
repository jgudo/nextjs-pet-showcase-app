const SomethingWentWrong = () => (
    <div className="container">
        <h1>Something went wrong.</h1>
        <span className="text-subtle">
            An unknown error has occured. I'll take care of this problem soonest.
        </span>
        <style jsx>
            {`
                .container {
                    padding: 0 50px;
                }
            `}
        </style>
    </div>
);

export default SomethingWentWrong;


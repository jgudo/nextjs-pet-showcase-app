const NoPetFound = () => (
    <div className="container">
        <h1>No Pet Found.</h1>
        <span className="text-subtle">
            Make sure to apply necessary filter or use specific keyword.
        </span>
        <style jsx>
            {`
                .container {
                    width: 100%;
                    padding: 20px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                    flex-direction: column;
                }
            `}
        </style>
    </div>
);

export default NoPetFound;
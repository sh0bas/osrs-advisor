const LoadingSpinner = ({ message = "Fetching player data" }) => {
    return (
        <div className="flex flex-col items-center justify-center py-8">
            <div className="coin-loader">
                <div className="coin"></div>
            </div>
            <p className="loading-text text-lg mt-4">
                {message}<span className="loading-dots"></span>
            </p>
        </div>
    );
};

export default LoadingSpinner;
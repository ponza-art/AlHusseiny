/* eslint-disable react/prop-types */
export default function Loading({ fullScreen = false }) {
    if (fullScreen) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="flex justify-center p-8">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    );
}
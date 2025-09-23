import { useState } from 'react';
// import { X } from 'lucide-react';

export default function VideoModalButton({ demo }: { demo: "https://www.youtube.com/embed/_xlNW5raJI4" }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Replace this with your actual YouTube video ID
    const youtubeVideoId = 'dQw4w9WgXcQ'; // Example video ID

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    console.log("watch demo", demo);
    return (
        <>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    openModal();
                }}
                className="bg-white text-primary border-2 border-primary  py-4 w-44 rounded-lg text-lg font-medium hover:bg-indigo-50 transition">
                Watch Demo
            </button>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50  flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black bg-opacity-75"
                        onClick={closeModal}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all"
                        >
                            X
                            {/* <X size={20} /> */}
                        </button>

                        {/* Video Container */}
                        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                            <iframe className='absolute top-0 left-0' height={'100%'} width={'100%'} src={`${demo}`} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen></iframe>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
export const Trusts = () => {


    const image = ['/img/image 4.png', '/img/image 5.png', '/img/image 6.png', '/img/image 7.png', '/img/image 8.png']

    return (
        <div className="py-20 max-w-[1310px] mx-auto flex flex-col gap-10 justify-center">
            <h1 className="text-5xl text-center font-bold text-gray-900 mb-4">Trusted by top companies worldwide</h1>
            <div className="flex items-center justify-between gap-10 w-full">
                {image?.map((img:any, index:any) => (
                    <div key={index} className="max-h-[120px]">
                        <img
                            src={img}
                            alt={`Company logo ${index + 1}`}
                            className="object-contain w-full h-full"
                        />
                    </div>
                ))}
            </div>
        </div>
    )

}

/* eslint-disable react/prop-types */

const Progressbar = ({visible, value, max}) => {
    const progress = (value / max) * 100
    return (
        <div className={`h-12 w-5/6 md:w-1/2 fixed left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl text-text-primary text-xl bg-neutral-light `
             + (visible ? "bottom-12" : "-bottom-full")
             + " transition-all duration-200 ease-in-out" 
        }>
            <h1 className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">Generating: {value} / {max}</h1>
            <div style={{width: `${progress}%`}} className={`h-full rounded-2xl bg-accent-green`}></div>
        </div>
    )
}

export default Progressbar
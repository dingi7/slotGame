import bigWinText from "../assets/bigWin.png"
import moneyGif from "../assets/money.gif"
import radialLight from "../assets/radialLight.png"

export const WinningModal = ({winAmmount}: {winAmmount: number}) => {
    return(
        <div className="w-1/3 h-2/5 rounded-lg absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] z-50 flex flex-col items-center justify-center">
            <img src={bigWinText} className="z-50 drop-shadow-lg"/>
            <img src={moneyGif} alt="Money GIF" className="absolute blur-sm" />
            <img src={radialLight} alt="Money GIF" className="absolute" />

            <div className="absolute bottom-[5%] text-7xl bg-neutral-600/60 px-[10%] py-[2%] rounded-full border-4 border-stone-700">
                <p className="bg-gradient-to-b from-red-400 font-bold  to-red-900 bg-clip-text text-transparent italic  text-shadow-superhot">{winAmmount}</p>
            </div>
        </div>
    )
}
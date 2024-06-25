import React, { useEffect, useState } from 'react';
import {
    Assets,
    Container,
    Texture,
    Sprite,
    BlurFilter,
    Ticker,
} from 'pixi.js';

import slotBackground from '../assets/slot-background.jpg';
import { Stage } from '@pixi/react';
import { RefreshCcw } from 'lucide-react';

const SlotMachinePixi: React.FC = () => {
    const rows = 3;
    const fixedBetAmounts = [20, 40, 100, 200];
    const [payout, setPayout] = useState<number>(0);
    const [betAmount, setBetAmount] = useState<number>(fixedBetAmounts[0]);
    const [spinning, setSpinning] = useState<boolean>(false);
    const windowWidth = window.innerWidth;
    const isMobile = windowWidth <= 768;
    const slotHeight = windowWidth * 0.1 * (isMobile ? 2 : 1);
    const totalHeight = slotHeight * rows;

    useEffect(() => {
        // const app = new Application();

        (async () => {
            //   await app.init({ background: '#1099bb', resizeTo: window });

            //   document.body.appendChild(app.view);

            await Assets.load([
                'https://pixijs.com/assets/eggHead.png',
                'https://pixijs.com/assets/flowerTop.png',
                'https://pixijs.com/assets/helmlok.png',
                'https://pixijs.com/assets/skully.png',
            ]);

            const REEL_WIDTH = 160;
            const SYMBOL_SIZE = 150;

            const slotTextures = [
                Texture.from('https://pixijs.com/assets/eggHead.png'),
                Texture.from('https://pixijs.com/assets/flowerTop.png'),
                Texture.from('https://pixijs.com/assets/helmlok.png'),
                Texture.from('https://pixijs.com/assets/skully.png'),
            ];

            const reels: any[] = [];
            const reelContainer = new Container();

            for (let i = 0; i < 5; i++) {
                const rc = new Container();
                rc.x = i * REEL_WIDTH;
                reelContainer.addChild(rc);

                const reel = {
                    container: rc,
                    symbols: [] as Sprite[],
                    position: 0,
                    previousPosition: 0,
                    blur: new BlurFilter(),
                };

                reel.blur.blurX = 0;
                reel.blur.blurY = 0;
                rc.filters = [reel.blur];

                for (let j = 0; j < 4; j++) {
                    const symbol = new Sprite(
                        slotTextures[
                            Math.floor(Math.random() * slotTextures.length)
                        ]
                    );
                    symbol.y = j * SYMBOL_SIZE;
                    symbol.scale.x = symbol.scale.y = Math.min(
                        SYMBOL_SIZE / symbol.width,
                        SYMBOL_SIZE / symbol.height
                    );
                    symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
                    reel.symbols.push(symbol);
                    rc.addChild(symbol);
                }
                reels.push(reel);
            }

            let running = false;

            function startPlay() {
                if (running) return;
                running = true;

                for (let i = 0; i < reels.length; i++) {
                    const r = reels[i];
                    const extra = Math.floor(Math.random() * 3);
                    const target = r.position + 10 + i * 5 + extra;
                    const time = 2500 + i * 600 + extra * 600;

                    tweenTo(
                        r,
                        'position',
                        target,
                        time,
                        backout(0.5),
                        null,
                        i === reels.length - 1 ? reelsComplete : null
                    );
                }
            }

            function reelsComplete() {
                running = false;
            }

            Ticker.shared.add(() => {
                for (let i = 0; i < reels.length; i++) {
                    const r = reels[i];

                    r.blur.blurY = (r.position - r.previousPosition) * 8;
                    r.previousPosition = r.position;

                    for (let j = 0; j < r.symbols.length; j++) {
                        const s = r.symbols[j];
                        const prevy = s.y;

                        s.y =
                            ((r.position + j) % r.symbols.length) *
                                SYMBOL_SIZE -
                            SYMBOL_SIZE;
                        if (s.y < 0 && prevy > SYMBOL_SIZE) {
                            s.texture =
                                slotTextures[
                                    Math.floor(
                                        Math.random() * slotTextures.length
                                    )
                                ];
                            s.scale.x = s.scale.y = Math.min(
                                SYMBOL_SIZE / s.texture.width,
                                SYMBOL_SIZE / s.texture.height
                            );
                            s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
                        }
                    }
                }
            });

            const tweening: any[] = [];

            function tweenTo(
                object: any,
                property: string,
                target: any,
                time: number,
                easing: any,
                onchange: any,
                oncomplete: any
            ) {
                const tween = {
                    object,
                    property,
                    propertyBeginValue: object[property],
                    target,
                    easing,
                    time,
                    change: onchange,
                    complete: oncomplete,
                    start: Date.now(),
                };

                tweening.push(tween);

                return tween;
            }

            Ticker.shared.add(() => {
                const now = Date.now();
                const remove: any[] = [];

                for (let i = 0; i < tweening.length; i++) {
                    const t = tweening[i];
                    const phase = Math.min(1, (now - t.start) / t.time);

                    t.object[t.property] = lerp(
                        t.propertyBeginValue,
                        t.target,
                        t.easing(phase)
                    );
                    if (t.change) t.change(t);
                    if (phase === 1) {
                        t.object[t.property] = t.target;
                        if (t.complete) t.complete(t);
                        remove.push(t);
                    }
                }
                for (let i = 0; i < remove.length; i++) {
                    tweening.splice(tweening.indexOf(remove[i]), 1);
                }
            });

            function lerp(a1: number, a2: number, t: number) {
                return a1 * (1 - t) + a2 * t;
            }

            function backout(amount: number) {
                return (t: number) => --t * t * ((amount + 1) * t + amount) + 1;
            }
        })();
    }, []);

    return (
        <div
            className={`w-full h-full flex flex-col justify-center items-center gap-5 bg-[url(${slotBackground})] ${
                isMobile && 'bg-cover'
            } text-white overflow-hidden`}
            style={{ backgroundImage: `url(${slotBackground})` }}
        >
            <div className='w-full h-full flex flex-col justify-center items-center'>
                <div className='flex gap-4 pt-[2%]'>
                    <p className='uppercase text-yellow-400 text-2xl font-semibold text-shadow-superhot'>
                        slot machine
                    </p>
                </div>

                <div className='my-auto relative'>
                    <Stage
                        options={{ backgroundAlpha: 0 }}
                        width={windowWidth * 0.391 * (isMobile ? 2 : 1)}
                        height={totalHeight}
                    >
                        {/* {assetsMatrix.map((column, colIndex) => (
                            <Container
                                x={
                                    (colIndex !== 0 ? colIndex : 0.01) *
                                    windowWidth *
                                    0.14 *
                                    (isMobile ? 2 : 1)
                                }
                                key={colIndex}
                            >
                                <Graphics
                                    draw={(g: PIXI.Graphics) => drawRect(g)}
                                />
                                {[...column, ...column].map(
                                    (asset, rowIndex) => (
                                        <Sprite
                                            key={rowIndex}
                                            image={asset.image}
                                            y={
                                                (positions[colIndex] +
                                                    rowIndex * slotHeight) %
                                                (totalHeight * 2)
                                            }
                                            x={
                                                isMobile
                                                    ? windowWidth * 0.01
                                                    : windowWidth * 0.005
                                            }
                                            width={
                                                windowWidth *
                                                0.1 *
                                                (isMobile ? 2 : 1)
                                            }
                                            height={slotHeight}
                                        />
                                    )
                                )}
                            </Container>
                        ))} */}
                        {/* {showLine && (
                            <Graphics
                                draw={(g: PIXI.Graphics) => drawLine(g)}
                            />
                        )} */}
                    </Stage>
                </div>

                {isMobile && (
                    <div className='mb-[10%] flex flex-col gap-2'>
                        <p className='uppercase text-xs text-slate-300'>
                            please, place your bet{' '}
                        </p>
                        <div className={`flex flex-row gap-2 md:gap-4`}>
                            {fixedBetAmounts.map((x) => (
                                <div
                                    className={`border-slate-200 border-2 px-4 py-2 rounded-md cursor-pointer shadow shadow-slate-500 text-sm md:text-base ${
                                        betAmount === x
                                            ? ' bg-gradient-to-b from-green-500 to-green-800'
                                            : 'bg-stone-600'
                                    }`}
                                    onClick={() => setBetAmount(x)}
                                >
                                    <p className='flex gap-[2%]'>
                                        <span className='font-semibold'>
                                            {x}
                                        </span>{' '}
                                        <span>BGN</span>
                                    </p>
                                    <p className='text-yellow-300 uppercase'>
                                        bet
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div
                className={`w-full md:w-[60%] mx-auto mb-0 mt-auto pb-4 flex  justify-evenly ${
                    isMobile ? 'items-end' : 'items-center'
                } select-none relative h-[15%]`}
            >
                <div>
                    <p className='uppercase font-semibold'>balance:</p>
                    <p>5000 BGN</p>
                </div>

                {!isMobile && (
                    <div className=' flex flex-col gap-2 relative'>
                        <p className='uppercase text-xs text-slate-300 absolute -top-5 left-1/2 -translate-x-[50%]'>
                            please, place your bet{' '}
                        </p>
                        <div className={`flex flex-row gap-2 md:gap-4`}>
                            {fixedBetAmounts.map((x) => (
                                <div
                                    className={`border-slate-200 border-2 px-4 py-2 rounded-md cursor-pointer shadow shadow-slate-500 text-sm md:text-base ${
                                        betAmount === x
                                            ? ' bg-gradient-to-b from-green-500 to-green-800'
                                            : 'bg-stone-600'
                                    }`}
                                    onClick={() => setBetAmount(x)}
                                >
                                    <p className='flex gap-[2%]'>
                                        <span className='font-semibold'>
                                            {x}
                                        </span>{' '}
                                        <span>BGN</span>
                                    </p>
                                    <p className='text-yellow-300 uppercase'>
                                        bet
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {isMobile && (
                    <button
                        className=' bg-stone-900/50 p-[2.5%]  h-full aspect-square flex justify-center items-center rounded-full border-2 border-slate-200 '
                        // onClick={startSpinning}
                        disabled={spinning}
                    >
                        <RefreshCcw
                            className={`opacity-100 ${
                                spinning ? 'animate-spin' : ''
                            } w-3/5 h-3/5`}
                        />
                    </button>
                )}

                {!isMobile && (
                    <button
                        className=' bg-stone-900/50 p-[2.5%] rounded-full border-2 border-slate-200'
                        onClick={() => {
                            // handleSpinRequest();
                            // startSpinning();
                        }}
                        disabled={spinning}
                    >
                        <RefreshCcw
                            className={`opacity-100 ${
                                spinning ? 'animate-spin' : ''
                            }`}
                        />
                    </button>
                )}

                <div className='uppercase'>
                    <p className='font-semibold'>last win:</p>
                    <p>{payout}</p>
                </div>
            </div>
        </div>
    );
};

export default SlotMachinePixi;

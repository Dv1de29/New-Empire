
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import '../style/Map.css';
import { useMapSettings } from './SettingContext';


///actual fetch
const getMap = async (mapName: string): Promise<string[][]> => {
    // return MP.europe.mapData.map(row => 
    //     row.map( cell => cell )
    // )
    const response = await fetch(`/resources/maps/${mapName}.txt`);

    if (response.ok) {
        const textData = await response.text();
        return textData.split('\n').map(row => Array.from(row));
    } else {
        throw new Error(`Failed to load map: ${response.status} ${response.statusText}`);
    }
}

const TerrainColors:{[key: string]: string; default: string} = {
    // 0: '#4A90E2', // Water (Blue)
    // 1: '#4bc3d5ff', // River
    // 4: '#795548', // Mountain (Brown/Gray)
    // 3: '#388E3C', // Plain (Dark Green)
    'W': '#4A90E2', // Water (Blue)
    'R': '#4bc3d5ff', // River
    'M': '#795548', // Mountain (Brown/Gray)
    'P': '#388E3C', // Plain (Dark Green)
    "F" : '#052607', // Forest
    "D" : '#74862dff', // Desert
    "I" : '#ffffff', // Ice
    default: '#D3D3D3' // Unknown (Light Gray)
}


function Map(){

    const { 
        committedEmpires,
        activeEmpireId,
        activeMap,
    } = useMapSettings();

    const [ MapData, setMapData ] = useState<string[][]>([]);
    const [ mapRow, setMapRow ] = useState<number>(0);
    const [ mapCol, setMapCol ] = useState<number>(0);
    const [ ownershipData, setOwnershipData ] = useState<number[][]>([])


    const activeEmpire = committedEmpires.find(empire => empire.id === activeEmpireId)

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const canvasOwner = useRef<HTMLCanvasElement>(null)

    const IdColor = useMemo(() => {
        const maaaap = new globalThis.Map<number, string>();
        committedEmpires.forEach(empire => {
            maaaap.set(empire.id, empire.color)
        })
        return maaaap;
    } ,[committedEmpires])

    
    
    const drawMap = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d')
        if (!ctx) return;
        
        const { width: canvasW, height: canvasH} = canvas;
        
        const tileH = canvasH / mapRow;
        const tileW = canvasW / mapCol;

        ctx.clearRect(0,0, canvasW, canvasH)
        
        for( let row = 0; row < mapRow; row++ ){
            for ( let col = 0; col < mapCol; col++ ){
                const color = TerrainColors[MapData[row][col] as keyof typeof TerrainColors] || TerrainColors.default
                
                ctx.fillStyle = color;
                
                ctx.fillRect( col * tileW, row * tileH, tileW, tileH)
                // ctx.strokeStyle = 'rgba(34, 34, 34, 0.1)'; // Lighter grid line
                // ctx.lineWidth = 0.5;
                // ctx.strokeRect(col * tileW, row * tileH, tileW, tileH);
            }
        }
        
        //// Drawing Ownership canvas
        const ownerCanvas = canvasOwner.current;
        if (!ownerCanvas) return
        
        const ctxOwner = ownerCanvas.getContext('2d')
        if (!ctxOwner) return
        
        ctxOwner.clearRect(0,0, canvasW, canvasH)

        console.log(ownershipData)
        
        
        
        // for (let row = 0; row < mapRow; row++ ){
        //     for (let col = 0; col <= mapCol; col++ ){
        //         if ( ownershipData[row][col] === 0 ){
        //             continue
        //         }
        //         const color = IdColor.get(ownershipData[row][col])
        //         if ( !color ) return
    
        //         ctxOwner.fillStyle = color
        //         ctxOwner.fillRect( col * tileW, row * tileH, tileW, tileH)
        //     }
        // }
        
        
    }, [MapData, mapRow, mapCol, ownershipData, IdColor])

    ///fecth map
    useEffect(() => {
        const fetchMap = async () => {
            try{
                const data = await getMap(activeMap);
                setMapData(data)
                setMapRow(data.length)
                setMapCol(data[0].length)
            } catch (error){
                console.log("An error occured in loading map data", error)
                setMapData([]);
            }
        }
        fetchMap()

        
    }, [activeMap]);
    
    // resize canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const container = canvas.parentElement;
        if (!container) return;

        const resizeCanvas = () => {
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
            drawMap();
        }

        resizeCanvas()

        window.addEventListener('resize', resizeCanvas);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };

    }, [drawMap])

    //// setting ownership data to 0
    useEffect(() => {
        if ( mapRow > 0 && mapCol > 0){
            const initialOwnership = Array.from({ length: mapRow}, () => {
                return Array.from({length: mapCol}, () => 0)
            })
            setOwnershipData(initialOwnership)
        }
    }, [MapData, mapRow, mapCol])

    const handleMapClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
        let canvas = canvasRef.current;
        if (!canvas){
            console.log("CANVAS NOT FOUND")
            return
        }

        const rect = canvas.getBoundingClientRect();

        const x = event.clientX - rect.left
        const y = event.clientY - rect.top

        const canvasX = x * (canvas.width / rect.width);
        const canvasY = y * (canvas.height / rect.height);

        // console.log(`Canvas Coordinates: (${canvasX}, ${canvasY})`);

        const { width: canvasW, height: canvasH} = canvas;
        
        const tileH = canvasH / mapRow;
        const tileW = canvasW / mapCol;

        const mapGridX = Math.floor(canvasX / tileW);
        const mapGridY = Math.floor(canvasY / tileH);

        console.log(mapGridX, mapGridY)

        setOwnershipData(prevOwner => {
            prevOwner[mapGridX][mapGridY] = activeEmpireId
            console.log(prevOwner)
            return prevOwner
        })

    }, [mapRow, mapCol, activeEmpireId])

    return (
        <>
            <div className="map_container">
                <div className="map_header">
                    
                </div>
                <div className="map">
                    <canvas 
                        className="map_canvas"
                        ref={canvasRef}
                        style={{ display: 'block', width: '100%', height: '100%' }}
                        onClick={handleMapClick}
                    />
                    <canvas 
                        className='owner_canvas'
                        ref={canvasOwner}
                        style={{ display: 'block', width: '100%', height: '100%' }}
                    />
                </div>
            </div>
        </>
    )
}

export default Map;
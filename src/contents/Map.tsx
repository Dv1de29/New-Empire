
import { useCallback, useEffect, useRef, useState } from 'react';
import '../style/Map.css';

interface MapProps{

}

const getMap = async (): Promise<string[][]> => {
    // return MP.europe.mapData.map(row => 
    //     row.map( cell => cell )
    // )
    const response = await fetch("/resources/maps/europe.txt");

    if (response.ok) {
        const textData = await response.text();
        console.log(textData)
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


function Map({}: MapProps){

    const [ MapData, setMapData ] = useState<string[][]>([]);
    const [ mapRow, setMapRow ] = useState<number>(0);
    const [ mapCol, setMapCol ] = useState<number>(0);

    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const fetchMap = async () => {
            try{
                const data = await getMap();
                setMapData(data)
                setMapRow(data.length)
                setMapCol(data[0].length)
                console.log(data)
            } catch (error){
                console.log("An error occured in loading map data", error)
                setMapData([]);
            }
        }
        fetchMap()
    }, []);

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
                ctx.strokeStyle = 'rgba(34, 34, 34, 0.1)'; // Lighter grid line
                ctx.lineWidth = 0.5;
                ctx.strokeRect(col * tileW, row * tileH, tileW, tileH);
            }
        }
    }, [MapData, mapRow, mapCol])

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
                    />
                </div>
            </div>
        </>
    )
}

export default Map;
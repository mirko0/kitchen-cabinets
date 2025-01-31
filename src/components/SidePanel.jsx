// SidePanel.js
import React from 'react';

const SidePanel = ({
    height,
    setHeight,
    width,
    setWidth,
    depth,
    setDepth,
    materialThickness,
    setMaterialThickness,
    toeKick,
    setToeKick,
    numShelves,
    setNumShelves,
    isWallCabinet,
    setIsWallCabinet,
    doors,
    setDoors,
    supportHeight,
    setSupportHeight,
}) => {
    const handleSubmit = () => {
        // Handle form submission or triggering updates for the preview
        console.log({ height, width, depth, materialThickness, toeKick, numShelves, isWallCabinet });
    };

    return (
        <div className="side-panel">
            <h2>Cabinet Settings</h2>
            <form>
                <label>
                    Height (cm):
                    <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                    />
                </label>

                <label>
                    Width (cm):
                    <input
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                    />
                </label>

                <label>
                    Depth (cm):
                    <input
                        type="number"
                        value={depth}
                        onChange={(e) => setDepth(e.target.value)}
                    />
                </label>

                <label>
                    Material Thickness (cm):
                    <input
                        type="number"
                        value={materialThickness}
                        onChange={(e) => setMaterialThickness(e.target.value)}
                    />
                </label>

                <label>
                    Number of Shelves:
                    <input
                        type="number"
                        value={numShelves}
                        onChange={(e) => setNumShelves(Number.parseInt(e.target.value))}
                    />
                </label>
                
                {!isWallCabinet && 
                <>
                <label>
                    Toe Kick Size:
                    <input
                        type="number"
                        value={toeKick}
                        onChange={(e) => setToeKick(e.target.value)}
                        disabled={isWallCabinet}
                    />
                </label>

                <label>
                    Support Height:
                    <input
                        type="number"
                        value={supportHeight}
                        onChange={(e) => setSupportHeight(e.target.value)}
                        disabled={isWallCabinet}
                    />
                </label>
                </>}
                
                <label>
                    Cabinet Type:
                    <select onChange={(e) => setIsWallCabinet(e.target.value === 'wall')} value={isWallCabinet ? 'wall' : 'floor'}>
                        <option value="floor">Floor Cabinet</option>
                        <option value="wall">Wall Cabinet</option>
                    </select>
                </label>


                <label>
                    Door Amount:
                    <input
                        type="number"
                        value={doors}
                        onChange={(e) => setDoors(e.target.value)}
                    />
                </label>

                <button type="button" onClick={handleSubmit}>Update Preview</button>
            </form>
        </div>
    );
};

export default SidePanel;

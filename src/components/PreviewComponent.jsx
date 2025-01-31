import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';

const PreviewComponent = ({
    height,
    width,
    depth,
    materialThickness,
    toeKick,
    numShelves,
    isWallCabinet,
    amountOfDoors,
}) => {

    const mountRef = useRef(null);
    useEffect(() => {
        // Set up the scene, camera, and renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 900 / 800, 0.1, 1000);
        camera.position.z = 150;

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(900, 800);
        mountRef.current.appendChild(renderer.domElement); // Attach the renderer to the DOM
        renderer.setClearColor(0xffffff, 1); // Set background color to white

        // Adjust for wall thickness
        const w = width - materialThickness * 2;
        const h = height - materialThickness * 2;
        const d = depth - materialThickness * 2;
        const drawH = !isWallCabinet && toeKick > 0 ? -toeKick : 0;

        if (!isWallCabinet && toeKick > 0) {

        }

        // Start with front and back face vertices
        let vertices = new Float32Array([
            // Front face (without toe kick)
            0, 0, 0, w, 0, 0,  // Bottom edge
            w, 0, 0, w, h, 0, // Right edge
            w, h, 0, 0, h, 0, // Top edge
            0, h, 0, 0, 0, 0,  // Left edge

            // Back face
            0, 0, -d, w, 0, -d, // Bottom edge
            w, 0, -d, w, h, -d, // Right edge
            w, h, -d, 0, h, -d, // Top edge
            0, h, -d, 0, 0, -d,  // Left edge

            // Connect front and back faces
            0, 0, 0, 0, 0, -d,  // Left vertical edge
            w, 0, 0, w, 0, -d,  // Right vertical edge
            w, h, 0, w, h, -d, // Right vertical edge (top)
            0, h, 0, 0, h, -d, // Left vertical edge (top)


            // INNER SIDES FRONT
            // TOP LINE
            materialThickness, +h - materialThickness, 0, w - materialThickness, +h - materialThickness, 0,  // TOP EDGE FRONT (inner)
            materialThickness, +h - materialThickness, -d, w - materialThickness, +h - materialThickness, -d,  // TOP EDGE BACK (inner)
            // Left side vertical line connecting the top and bottom
            materialThickness, h - materialThickness, 0, materialThickness, h - materialThickness, -d,  // Left side vertical
            // Right side vertical line connecting the top and bottom
            w - materialThickness, h - materialThickness, 0, w - materialThickness, h - materialThickness, -d,  // Right side vertical


            // Bottom edge (inner)
            materialThickness, 0 + materialThickness, 0, w - materialThickness, 0 + materialThickness, 0,  // Bottom edge (inner front side)
            materialThickness, 0 + materialThickness, -d, w - materialThickness, 0 + materialThickness, -d,  // Bottom edge (inner back side)
            materialThickness, materialThickness, 0, materialThickness, materialThickness, -d,  // Left side vertical
            w - materialThickness, materialThickness, 0, w - materialThickness, materialThickness, -d,  // Right side vertical

            // VERTICAL FRONT
            materialThickness, +h - materialThickness, 0, materialThickness, 0 + materialThickness, 0, // Left line from toe kick to bottom corner
            w - materialThickness, +h - materialThickness, 0, w - materialThickness, 0 + materialThickness, 0, // Right line from toe kick to bottom corner
            //Vertical BACK

            materialThickness, +h - materialThickness, -d, materialThickness, 0 + materialThickness, -d, // Left line from toe kick to bottom corner
            w - materialThickness, +h - materialThickness, -d, w - materialThickness, 0 + materialThickness, -d, // Right line from toe kick to bottom corner

        ]);






        // If it's a floor cabinet, include the toe kick
        // if (!isWallCabinet && toeKick > 0) {
        //     // Modify the front face geometry to include the toe kick on the bottom (outside of the cabinet)
        //     const toeKickVertices = new Float32Array([
        //         // Bottom edge of the toe kick (moved inward by material thickness)
        //         materialThickness, +toeKick, 0, w - materialThickness, +toeKick, 0,  // Bottom edge (below the cabinet)
        //         // Left side of the toe kick (connecting to bottom corner of the cabinet)
        //         materialThickness, +toeKick, 0, materialThickness, 0, 0, // Left line from toe kick to bottom corner
        //         // Right side of the toe kick (connecting to bottom corner of the cabinet)
        //         w - materialThickness, +toeKick, 0, w - materialThickness, 0, 0, // Right line from toe kick to bottom corner
        //     ]);

        //     // Concatenate new toe kick vertices with the existing ones
        //     vertices = new Float32Array([...vertices, ...toeKickVertices]);
        // }

        if (numShelves > 0) {
            const shelfHeight = (height - materialThickness) / (Number.parseInt(numShelves) + 1);
            let shelfVertices = [];

            for (let i = 1; i <= numShelves; i++) {
                const yPosition = i * shelfHeight;
                console.log("YPos" + i + ": " + yPosition)
                const wMinusThickness = w - materialThickness;

                // Add 3D shelf vertices (top and bottom edges)
                shelfVertices.push(
                    materialThickness, yPosition, -materialThickness, wMinusThickness, yPosition, -materialThickness,  // Front bottom edge
                    wMinusThickness, yPosition, -materialThickness, wMinusThickness, yPosition, -d + materialThickness, // Right edge
                    wMinusThickness, yPosition, -d + materialThickness, materialThickness, yPosition, -d + materialThickness, // Back bottom edge
                    materialThickness, yPosition, -d + materialThickness, materialThickness, yPosition, -materialThickness, // Left edge

                    materialThickness, yPosition + materialThickness, -materialThickness, wMinusThickness, yPosition + materialThickness, -materialThickness, // Front bottom edge (depth)
                    wMinusThickness, yPosition + materialThickness, -materialThickness, wMinusThickness, yPosition + materialThickness, -d + materialThickness, // Right edge (depth)
                    wMinusThickness, yPosition + materialThickness, -d + materialThickness, materialThickness, yPosition + materialThickness, -d + materialThickness, // Back bottom edge (depth)
                    materialThickness, yPosition + materialThickness, -d + materialThickness, materialThickness, yPosition + materialThickness, -materialThickness // Left edge (depth)
                );

                const numVerticalLines = 5;  // Set the number of vertical lines you want (adjust as needed)
                // Calculate spacing for vertical lines
                const verticalLineSpacing = (w - 2 * materialThickness) / (numVerticalLines + 1); // Dynamic spacing based on the number of lines

                // Front side vertical lines
                for (let j = 1; j <= numVerticalLines; j++) { // Add specified number of lines
                    const xPosition = materialThickness + j * verticalLineSpacing;
                    // Vertical line from bottom to top on front
                    shelfVertices.push(
                        xPosition, yPosition, -materialThickness, // Bottom edge of vertical line
                        xPosition, yPosition + materialThickness, -materialThickness  // Top edge of vertical line
                    );
                }

                // Back side vertical lines
                for (let j = 1; j <= numVerticalLines; j++) { // Add specified number of lines on back
                    const xPosition = materialThickness + j * verticalLineSpacing;
                    // Vertical line from bottom to top on back
                    shelfVertices.push(
                        xPosition, yPosition, -d + materialThickness, // Bottom edge of vertical line
                        xPosition, yPosition + materialThickness, -d + materialThickness  // Top edge of vertical line
                    );
                }

            }

            // Concatenate the shelf vertices with the existing vertices array
            vertices = new Float32Array([...vertices, ...shelfVertices]);
            console.log("=================== END ======================")
        }




        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.computeVertexNormals();
        geometry.needsUpdate = true;

        // Create a material for the lines (wireframe style)
        const material = new THREE.LineBasicMaterial({ color: 0x000000 });

        // Create a line object from the geometry and material
        const line = new THREE.LineSegments(geometry, material);
        scene.add(line);

        // Create and add measurement labels
        const createTextLabel = (text, position) => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            context.font = '60px Arial'; // Larger font size
            context.fillStyle = 'black';
            context.fillText(text, 0, 50); // Adjust the y position to ensure the text fits

            // Ensure the canvas texture is updated after the text is drawn
            const texture = new THREE.Texture(canvas);
            texture.needsUpdate = true; // Now we ensure texture is updated after drawing

            const material = new THREE.SpriteMaterial({ map: texture });
            const sprite = new THREE.Sprite(material);
            sprite.position.set(position[0], position[1], position[2]);
            sprite.scale.set(15, 15, 1); // Increased scale for larger text

            // Add sprite to scene
            scene.add(sprite);
        };

        // Add measurements for the cabinet edges
        createTextLabel(`${width} cm`, [w / 2, 0, 0]); // Width measurement
        createTextLabel(`${height} cm`, [0, h / 2, 0]); // Height measurement
        createTextLabel(`${depth} cm`, [0, 0, -d / 2]); // Depth measurement

        // Set camera position to better view the cabinet
        camera.position.z = 150;
        camera.position.x = -30;
        camera.position.y = 100;

        // Add OrbitControls for mouse interaction
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.screenSpacePanning = false;

        // Animation loop to render the scene
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update(); // Update controls
            renderer.render(scene, camera);
        };

        animate();

        // Clean up when the component is unmounted
        return () => {
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
        };
    }, [height, width, depth, materialThickness, toeKick, numShelves, isWallCabinet]);

    return <div ref={mountRef} className="preview-3d-container" />;
};

export default PreviewComponent;

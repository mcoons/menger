window.onload = function() {
   
        var maxInterval = 1;  
        const remove = [4, 10, 12, 13, 14, 16, 22];
        const scales = [243, 81, 27, 9, 3 ,1, 1/3];
        const cloneScales = [1, 1/3, 1/9, 1/27, 1/81, 1/243];
        var meshes = [];

        function createScene(engine, canvas){

            var scene = new BABYLON.Scene(engine);

            var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 345, -1050), scene);
            camera.setTarget(new BABYLON.Vector3(0,0,0));
            camera.attachControl(canvas, false);

            var hlight = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,1), scene);
            hlight.intensity = .3;

            var plight1 = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(-600, 50, 0), scene);
            var plight2 = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(0, -600, 0), scene);
            var plight3 = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(0, 250, -600), scene);
            plight1.diffuse = new BABYLON.Color3(1, .2, .2);
            plight2.diffuse = new BABYLON.Color3(.2, 1, .2);
            plight3.diffuse = new BABYLON.Color3(.2, .2, 1);

            return scene;
        }

        // create multiple menger sponges
        function createSponge(scene, mat){

            // create an initial block to prime the template
            let template = BABYLON.MeshBuilder.CreateBox("box", {height: 243, width: 243, depth: 243}, scene);

            // create a template and 4 menger sponges
            // use the previous mesh sponge as a template block for the next sponge
            for (let j = 0; j <= 4; j++){

                calculateCenters(new BABYLON.Vector3(0,0,0), 1, template);

                template = BABYLON.Mesh.MergeMeshes(meshes, true, true);
                template.position = new BABYLON.Vector3(-500+(250*j),0,0);
                template.name = "box"+j;

                meshes = [];

                // increase the max interval after the initial template creation
                if (maxInterval === 1) 
                    maxInterval = 2;
            }
            // dispose of the initial box template
            scene.getMeshByName('box').dispose();
        }

        // Recursively calculate 27 centers of surrounding blocks
        function calculateCenters(center, interval, template){

            // If complexity is reached then render the template and return
            if (interval === maxInterval){

                let box = template.clone("clone");    

                box.scaling = new BABYLON.Vector3(cloneScales[interval-1],cloneScales[interval-1],cloneScales[interval-1]);
                box.position = center;

                meshes.push(box);

                return;
            }

            // Get the scale for this intervals centers delta
            let s3 = scales[interval];

            // Count is the 'location'of the block to determine the removal
            let count = 0;

            // Calculate the new block centers ignoring the central removed blocks
            for (let y = center.y-s3; y <= center.y+s3; y+=s3)
            for (let z = center.z-s3; z <= center.z+s3; z+=s3)
            for (let x = center.x-s3; x <= center.x+s3; x+=s3){
                if (!remove.includes(count)) 
                    calculateCenters(new BABYLON.Vector3(x,y,z), interval+1, template);
                count++;
            }
        }

        // window.addEventListener('DOMContentLoaded', function(){

            var canvas = document.getElementById('renderCanvas');
            var engine = new BABYLON.Engine(canvas, true);
            var scene = createScene(engine, canvas);

            createSponge(scene);
            document.getElementById("calculating").style.display = "none"

            // scene.getMeshByName('box0').dispose();
            // scene.getMeshByName('box1').dispose();
            // scene.getMeshByName('box2').dispose();
            // scene.getMeshByName('box3').dispose();

            engine.runRenderLoop(function(){ 
                scene.render(); 
                // console.log("indices:", scene.getActiveIndices())
                // console.log("meshes:", scene.getActiveMeshes())
            });

            window.addEventListener('resize', function(){ 
                engine.resize(); 
            });
        // });
}


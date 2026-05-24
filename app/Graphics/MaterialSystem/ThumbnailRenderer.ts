import * as THREE from 'three';

import { GLTFLoader }
from 'three/examples/jsm/loaders/GLTFLoader.js';

export class ThumbnailRenderer {

  async generatePreview(
    file: File
  ): Promise<Blob> {

    return new Promise(
      (resolve, reject) => {

        //
        // SCENE
        //
        const scene =
          new THREE.Scene();

        scene.background =
          new THREE.Color(0x222222);

        //
        // CAMERA
        //
        const camera =
          new THREE.PerspectiveCamera(
            45,
            1,
            0.1,
            1000
          );

        //
        // RENDERER
        //
        const renderer =
          new THREE.WebGLRenderer({

            antialias: true,

            preserveDrawingBuffer: true,

          });

        renderer.setSize(
          512,
          512
        );

        //
        // LIGHTS
        //
        scene.add(
          new THREE.AmbientLight(
            0xffffff,
            1.5
          )
        );

        const light =
          new THREE.DirectionalLight(
            0xffffff,
            2
          );

        light.position.set(
          5,
          10,
          5
        );

        scene.add(light);

        //
        // LOADER
        //
        const loader =
          new GLTFLoader();

        const objectUrl =
          URL.createObjectURL(file);

        loader.load(

          objectUrl,

          (gltf) => {

            const model =
              gltf.scene;

            scene.add(model);

            //
            // CENTER
            //
            const box =
              new THREE.Box3()
                .setFromObject(model);

            const center =
              box.getCenter(
                new THREE.Vector3()
              );

            model.position.sub(center);

            //
            // FIT CAMERA
            //
            const size =
              box.getSize(
                new THREE.Vector3()
              );

            const maxDim =
              Math.max(
                size.x,
                size.y,
                size.z
              );

            camera.position.set(
              maxDim * 1.5,
              maxDim,
              maxDim * 1.5
            );

            camera.lookAt(
              0,
              0,
              0
            );

            //
            // RENDER
            //
            renderer.render(
              scene,
              camera
            );

            //
            // EXPORT
            //
            renderer.domElement.toBlob(

              (blob) => {

                if (!blob) {

                  reject(
                    'PREVIEW FAILED'
                  );

                  return;
                }

                URL.revokeObjectURL(
                  objectUrl
                );

                renderer.dispose();

                resolve(blob);

              },

              'image/png'
            );
          },

          undefined,

          (err) => {

            reject(err);

          }
        );
      }
    );
  }
}
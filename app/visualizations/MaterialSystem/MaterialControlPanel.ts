import * as THREE from 'three';

export interface MaterialControlState {
  repeatX: number;
  repeatY: number;
  displacementScale: number;
  normalScale: number;
  roughness: number;
  aoIntensity: number;
}

export default class MaterialControlPanel {
  private container: HTMLDivElement;

  public state: MaterialControlState = {
    repeatX: 2,
    repeatY: 2,
    displacementScale: 0.25,
    normalScale: 1,
    roughness: 1,
    aoIntensity: 1,
  };

  constructor(
    private material: THREE.MeshStandardMaterial,
    private textures: {
      color?: THREE.Texture;
      normal?: THREE.Texture;
      roughness?: THREE.Texture;
      ao?: THREE.Texture;
      displacement?: THREE.Texture;
    }
  ) {
    this.container = document.createElement('div');

    this.buildUI();

    document.body.appendChild(this.container);
  }

  private buildUI() {
    this.container.style.position = 'fixed';
    this.container.style.top = '20px';
    this.container.style.right = '20px';
    this.container.style.width = '260px';

    this.container.style.padding = '16px';
    this.container.style.borderRadius = '12px';

    this.container.style.background = 'rgba(0,0,0,0.55)';
    this.container.style.backdropFilter = 'blur(8px)';

    this.container.style.color = 'white';

    this.container.style.zIndex = '99999';

    this.container.style.fontFamily = 'sans-serif';

    this.container.style.display = 'flex';
    this.container.style.flexDirection = 'column';

    this.container.style.gap = '12px';

    this.createSlider(
      'Texture Repeat X',
      1,
      20,
      this.state.repeatX,
      (value) => {
        this.state.repeatX = value;

        this.updateTextureRepeats();
      }
    );

    this.createSlider(
      'Texture Repeat Y',
      1,
      20,
      this.state.repeatY,
      (value) => {
        this.state.repeatY = value;

        this.updateTextureRepeats();
      }
    );

    this.createSlider(
      'Displacement Scale',
      0,
      2,
      this.state.displacementScale,
      (value) => {
        this.state.displacementScale = value;

        this.material.displacementScale = value;
      },
      0.01
    );

    this.createSlider(
      'Normal Scale',
      0,
      5,
      this.state.normalScale,
      (value) => {
        this.state.normalScale = value;

        this.material.normalScale = new THREE.Vector2(
          value,
          value
        );
      },
      0.01
    );

    this.createSlider(
      'Roughness',
      0,
      1,
      this.state.roughness,
      (value) => {
        this.state.roughness = value;

        this.material.roughness = value;
      },
      0.01
    );

    this.createSlider(
      'AO Intensity',
      0,
      5,
      this.state.aoIntensity,
      (value) => {
        this.state.aoIntensity = value;

        this.material.aoMapIntensity = value;
      },
      0.01
    );
  }

  private createSlider(
    labelText: string,
    min: number,
    max: number,
    initialValue: number,
    onInput: (value: number) => void,
    step = 1
  ) {
    const wrapper = document.createElement('div');

    const label = document.createElement('label');

    label.innerText = `${labelText}: ${initialValue}`;

    label.style.fontSize = '12px';

    const slider = document.createElement('input');

    slider.type = 'range';

    slider.min = String(min);
    slider.max = String(max);

    slider.step = String(step);

    slider.value = String(initialValue);

    slider.style.width = '100%';

    slider.oninput = (e) => {
      const value = Number(
        (e.target as HTMLInputElement).value
      );

      label.innerText = `${labelText}: ${value}`;

      onInput(value);
    };

    wrapper.appendChild(label);

    wrapper.appendChild(slider);

    this.container.appendChild(wrapper);
  }

  private updateTextureRepeats() {
    const allTextures = Object.values(this.textures);

    allTextures.forEach((texture) => {
      if (!texture) return;

      texture.repeat.set(
        this.state.repeatX,
        this.state.repeatY
      );

      texture.needsUpdate = true;
    });
  }
}
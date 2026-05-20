export interface SelectedMaterialFiles {
  albedo?: File;
  normal?: File;
  roughness?: File;
  ao?: File;
  displacement?: File;
}

export default class RegisterMaterialPanel {
  private container: HTMLDivElement;

  private files: SelectedMaterialFiles = {};

  constructor() {
    this.container = document.createElement('div');

    this.buildUI();

    document.body.appendChild(this.container);
  }

  private buildUI() {
    this.container.style.position = 'fixed';

    this.container.style.left = '20px';

    this.container.style.top = '20px';

    this.container.style.width = '320px';

    this.container.style.padding = '16px';

    this.container.style.background =
      'rgba(0,0,0,0.55)';

    this.container.style.backdropFilter =
      'blur(8px)';

    this.container.style.borderRadius = '12px';

    this.container.style.color = 'white';

    this.container.style.zIndex = '99999';

    this.container.style.fontFamily =
      'sans-serif';

    this.container.style.display = 'flex';

    this.container.style.flexDirection =
      'column';

    this.container.style.gap = '12px';

    const title = document.createElement('h2');

    title.innerText = 'Register Material';

    title.style.fontSize = '18px';

    title.style.margin = '0';

    this.container.appendChild(title);

    this.createFileInput(
      'Albedo',
      'albedo'
    );

    this.createFileInput(
      'Normal',
      'normal'
    );

    this.createFileInput(
      'Roughness',
      'roughness'
    );

    this.createFileInput(
      'AO',
      'ao'
    );

    this.createFileInput(
      'Displacement',
      'displacement'
    );

    const registerButton =
      document.createElement('button');

    registerButton.innerText =
      'RegisterMaterial';

    registerButton.style.padding =
      '12px';

    registerButton.style.border = 'none';

    registerButton.style.borderRadius =
      '8px';

    registerButton.style.cursor = 'pointer';

    registerButton.onclick = () => {
      this.registerMaterial();
    };

    this.container.appendChild(
      registerButton
    );
  }

  private createFileInput(
    labelText: string,
    key: keyof SelectedMaterialFiles
  ) {
    const wrapper =
      document.createElement('div');

    wrapper.style.display = 'flex';

    wrapper.style.flexDirection =
      'column';

    wrapper.style.gap = '6px';

    const label =
      document.createElement('label');

    label.innerText = labelText;

    const input =
      document.createElement('input');

    input.type = 'file';

    input.accept =
      '.jpg,.jpeg,.png,.webp';

    input.onchange = (e) => {
      const target =
        e.target as HTMLInputElement;

      const file =
        target.files?.[0];

      if (!file) return;

      this.files[key] = file;

      console.log(
        `${labelText} selected`,
        file.name
      );
    };

    wrapper.appendChild(label);

    wrapper.appendChild(input);

    this.container.appendChild(wrapper);
  }

  private async registerMaterial() {
    const formData = new FormData();

    Object.entries(this.files).forEach(
      ([key, file]) => {
        if (!file) return;

        formData.append(key, file);
      }
    );

    try {
      const response = await fetch(
        '/api/material/register',
        {
          method: 'POST',

          body: formData,
        }
      );

      const result =
        await response.json();

      console.log(
        'REGISTER SUCCESS',
        result
      );
    } catch (err) {
      console.error(
        'REGISTER FAILED',
        err
      );
    }
  }
}
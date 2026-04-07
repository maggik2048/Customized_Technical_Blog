import unreal

MAX_SIZE = 700
resized_textures = []

# Get all assets in the /Game folder
all_assets = unreal.EditorAssetLibrary.list_assets("/Game", recursive=True, include_folder=True)

for asset_path in all_assets:
    tex = unreal.EditorAssetLibrary.load_asset(asset_path)
    if isinstance(tex, unreal.Texture2D):
        source = tex.get_source()
        width = source.get_size_x()
        height = source.get_size_y()

        # Only resize if larger than MAX_SIZE
        if width > MAX_SIZE or height > MAX_SIZE:
            scale = min(MAX_SIZE / width, MAX_SIZE / height)
            new_width = int(width * scale)
            new_height = int(height * scale)

            # Resize the texture
            unreal.TextureEditorSubsystem().resize_texture(tex, new_width, new_height)
            unreal.EditorAssetLibrary.save_asset(asset_path)
            
            resized_textures.append((tex.get_name(), width, height, new_width, new_height))
            print(f"[RESIZED] {tex.get_name()}: {width}x{height} → {new_width}x{new_height}")

# Summary
print(f"\n=== RESIZE COMPLETE ===")
print(f"Total textures resized: {len(resized_textures)}")
for name, old_w, old_h, new_w, new_h in resized_textures:
    print(f"{name}: {old_w}x{old_h} → {new_w}x{new_h}")
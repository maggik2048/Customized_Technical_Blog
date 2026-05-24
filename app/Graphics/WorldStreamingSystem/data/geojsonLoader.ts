export async function loadWorldData() {
  const res = await fetch(
    "/gis/losAngeles.geojson"
  );

  if (!res.ok) {
    throw new Error(
      "Failed to load GIS world data"
    );
  }

  return await res.json();
}
import { menu } from "./components/sidebarData";
import CategoryCard from "./components/CategoryCard";

export default function HomePage() {
  return (
    <div>
      {/* 🔥 HERO SECTION */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start", // 위쪽 정렬
          paddingTop: "40px", // 타이틀 위로 살짝 이동
          paddingLeft: "80px",
        }}
      >
        {/* 🔥 HERO TITLE */}
        <div style={{ position: "relative", height: "9vh", marginBottom: "1.5rem" }}>
          <h1
            className="hero-title"
            style={{
              fontSize: "9vh",
            }}
          >
            Graphics Lab V2
          </h1>

          <div
            style={{
              position: "absolute",
              top: 0,
              left: "180px",
              width: "630px",
              height: "100%",
              overflow: "hidden",
            }}
          >
            <h1
              className="hero-title-white"
              style={{
                fontSize: "9vh",
                position: "absolute",
                top: 0,
                left: "-180px",
              }}
            >
              Graphics Lab V2
            </h1>
          </div>
        </div>

        {/* 🔥 CATEGORY GRID 바로 아래 */}
        <div
          style={{
            maxWidth: "1024px",
            margin: "300px auto 0 auto", 
            padding: "0 1rem",
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {menu.map((section) =>
              section.children?.map((item) => <CategoryCard key={item.name} item={item} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
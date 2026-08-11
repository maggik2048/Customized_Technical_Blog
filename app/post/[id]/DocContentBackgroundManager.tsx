"use client";

import React from "react";
import { useTheme } from "@/app/contexts/ThemeContext";

// ============================================================
// CONSTANTES DES IMAGES DE FOND
// ============================================================
const DEFAULT_BG_IMAGE = "/images/dossierBg/woodmarble233.png";
const MARBLE_BG_IMAGE = "/images/dossierBg/marble2.png";
const MARBLE3_BG_IMAGE = "/images/dossierBg/marble2.png";

// ============================================================
// INTERFACE DES PROPS
// ============================================================
interface DocContentBackgroundManagerProps {
  children: React.ReactNode;
  parentPaddingLeft?: number;
  parentPaddingRight?: number;
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: "cover" | "contain" | "auto" | string;
  backgroundPosition?: string;
  backgroundRepeat?: "no-repeat" | "repeat" | "repeat-x" | "repeat-y";
  backgroundBlendMode?: string;
  paddingTop?: number;
  paddingBottom?: number;
  forceDefaultBackground?: boolean;
  forceMarbleBackground?: boolean;
  forceMarble3Background?: boolean;
  
  // marble2.png
  marbleBackgroundSize?: string;
  marbleBackgroundRepeat?: "no-repeat" | "repeat" | "repeat-x" | "repeat-y";
  
  // woodmarble233.png
  woodMarbleBackgroundSize?: string;
  woodMarbleBackgroundRepeat?: "no-repeat" | "repeat" | "repeat-x" | "repeat-y";
  
  // marble333.png
  marble3BackgroundSize?: string;
  marble3BackgroundRepeat?: "no-repeat" | "repeat" | "repeat-x" | "repeat-y";
  marble3BlendMode?: "multiply" | "screen" | "overlay" | "darken" | "lighten";
  marble3Opacity?: number;
  marble3TileSize?: string; // 🔥 NOUVEAU
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================
export default function DocContentBackgroundManager({
  children,
  parentPaddingLeft = 64,
  parentPaddingRight = 64,
  backgroundColor = "transparent",
  backgroundImage,
  backgroundSize = "auto",
  backgroundPosition = "center center",
  backgroundRepeat = "repeat",
  backgroundBlendMode = "overlay",
  paddingTop = 20,
  paddingBottom = 20,
  forceDefaultBackground = false,
  forceMarbleBackground = false,
  forceMarble3Background = false,
  
  // marble2
  marbleBackgroundSize = "1200px 800px",
  marbleBackgroundRepeat = "repeat",
  
  // woodmarble
  woodMarbleBackgroundSize = "auto",
  woodMarbleBackgroundRepeat = "repeat",
  
  // 🔥🔥🔥 marble333 - CHANGÉ POUR FONCTIONNER
  marble3BackgroundSize = "600px 600px", // ← CHANGÉ : "cover" → "600px 600px"
  marble3BackgroundRepeat = "repeat",    // ← IMPORTANT : "repeat"
  marble3BlendMode = "multiply",
  marble3Opacity = 0.5,
  marble3TileSize = "600px 600px", // ← NOUVEAU PARAMÈTRE
}: DocContentBackgroundManagerProps) {
  
  let theme;
  try {
    theme = useTheme();
  } catch (error) {
    console.warn("DocContentBackgroundManager: ThemeProvider not found");
    theme = null;
  }

  const getMainBackgroundImage = (): string => {
    if (backgroundImage) return backgroundImage;
    if (forceDefaultBackground) return DEFAULT_BG_IMAGE;
    if (forceMarbleBackground) return MARBLE_BG_IMAGE;
    if (forceMarble3Background) return MARBLE3_BG_IMAGE;
    if (!theme) return DEFAULT_BG_IMAGE;
    return theme.isDefaultTheme ? MARBLE_BG_IMAGE : DEFAULT_BG_IMAGE;
  };

  const getMainBackgroundSize = (): string => {
    if (backgroundImage && backgroundSize) return backgroundSize;
    if (forceDefaultBackground) return woodMarbleBackgroundSize;
    if (forceMarbleBackground) return marbleBackgroundSize;
    if (forceMarble3Background) return marble3BackgroundSize;
    if (!theme) return woodMarbleBackgroundSize;
    return theme.isDefaultTheme ? marbleBackgroundSize : woodMarbleBackgroundSize;
  };

  const getMainBackgroundRepeat = (): string => {
    if (backgroundImage && backgroundRepeat) return backgroundRepeat;
    if (forceDefaultBackground) return woodMarbleBackgroundRepeat;
    if (forceMarbleBackground) return marbleBackgroundRepeat;
    if (forceMarble3Background) return marble3BackgroundRepeat;
    if (!theme) return woodMarbleBackgroundRepeat;
    return theme.isDefaultTheme ? marbleBackgroundRepeat : woodMarbleBackgroundRepeat;
  };

  const buildContainerStyle = (): React.CSSProperties => {
    // CAS SPÉCIAL: FORCER marble333.png
    if (forceMarble3Background) {
      const imageUrl = MARBLE3_BG_IMAGE;
      const size = marble3TileSize || marble3BackgroundSize;
      const repeat = marble3BackgroundRepeat;
      const pos = backgroundPosition;
      const blend = marble3BlendMode;
      const opacity = marble3Opacity;

      return {
        marginLeft: -parentPaddingLeft,
        marginRight: -parentPaddingRight,
        paddingLeft: parentPaddingLeft,
        paddingRight: parentPaddingRight,
        paddingTop,
        paddingBottom,
        position: "relative",
        backgroundColor: backgroundColor,
        
        backgroundImage: `
          linear-gradient(
            rgba(255, 255, 255, ${1 - opacity}),
            rgba(255, 255, 255, ${1 - opacity})
          ),
          url(${imageUrl}),
          url(${imageUrl})
        `,
        backgroundSize: `cover, ${size}, ${size}`,
        backgroundRepeat: `no-repeat, ${repeat}, ${repeat}`,
        backgroundPosition: `center, ${pos}, ${pos}`,
        backgroundBlendMode: `normal, ${blend}, normal`,
      };
    }

    // 🔥 CAS PRINCIPAL: SUPERPOSITION POUR marble222.png
    const isDefaultTheme = theme?.isDefaultTheme ?? false;
    const isForceMarble = forceMarbleBackground;
    const isUsingMarble222 = isDefaultTheme || isForceMarble;
    
    const mainImage = getMainBackgroundImage();
    const mainSize = getMainBackgroundSize();
    const mainRepeat = getMainBackgroundRepeat();

    // 🔥🔥🔥 SI c'est marble222.png, on ajoute la superposition
    if (isUsingMarble222 && mainImage === MARBLE_BG_IMAGE) {
      const overlayImage = MARBLE3_BG_IMAGE;
      // 🔥 Utiliser marble3TileSize pour contrôler la densité
      const overlaySize = marble3TileSize || marble3BackgroundSize;
      const overlayRepeat = marble3BackgroundRepeat;
      const overlayBlend = marble3BlendMode;
      const overlayOpacity = marble3Opacity;

      return {
        marginLeft: -parentPaddingLeft,
        marginRight: -parentPaddingRight,
        paddingLeft: parentPaddingLeft,
        paddingRight: parentPaddingRight,
        paddingTop,
        paddingBottom,
        position: "relative",
        backgroundColor: backgroundColor,
        
        backgroundImage: `
          linear-gradient(
            rgba(255, 255, 255, ${1 - overlayOpacity}),
            rgba(255, 255, 255, ${1 - overlayOpacity})
          ),
          url(${overlayImage}),
          url(${mainImage})
        `,
        backgroundSize: `cover, ${overlaySize}, ${mainSize}`,
        backgroundRepeat: `no-repeat, ${overlayRepeat}, ${mainRepeat}`,
        backgroundPosition: `center, ${backgroundPosition}, ${backgroundPosition}`,
        backgroundBlendMode: `normal, ${overlayBlend}, normal`,
      };
    }

    // CAS NORMAL : une seule couche
    return {
      marginLeft: -parentPaddingLeft,
      marginRight: -parentPaddingRight,
      paddingLeft: parentPaddingLeft,
      paddingRight: parentPaddingRight,
      paddingTop,
      paddingBottom,
      position: "relative",
      backgroundColor: backgroundColor,
      backgroundImage: `url(${mainImage})`,
      backgroundSize: mainSize,
      backgroundRepeat: mainRepeat,
      backgroundPosition: backgroundPosition,
      backgroundBlendMode: backgroundBlendMode,
    };
  };

  const containerStyle = buildContainerStyle();

  const contentStyle: React.CSSProperties = {
    position: "relative",
    zIndex: 1,
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>{children}</div>
    </div>
  );
}
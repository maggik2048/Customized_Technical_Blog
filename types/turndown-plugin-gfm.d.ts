/**
 * Déclarations de types pour turndown-plugin-gfm
 * Ce fichier fournit les types TypeScript pour le plugin GFM de Turndown
 */

declare module 'turndown-plugin-gfm' {
  import TurndownService from 'turndown';

  /**
   * Plugin GFM (GitHub Flavored Markdown) pour Turndown
   * Ajoute le support pour :
   * - Tableaux
   * - Barré
   * - Listes de tâches
   */
  export function gfm(turndownService: TurndownService): void;

  /**
   * Plugin pour les tableaux
   */
  export function tables(turndownService: TurndownService): void;

  /**
   * Plugin pour le texte barré
   */
  export function strikethrough(turndownService: TurndownService): void;

  /**
   * Plugin pour les listes de tâches
   */
  export function taskListItems(turndownService: TurndownService): void;
}
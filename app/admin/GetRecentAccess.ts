import { supabase } from "@/lib/supabase";

type MetadataItem = {
  name: string;
  slug: string;
  group?: string;
};

type ProjectItem = {
  name: string;
  slug: string;
  description?: string;
  categories: string[];
  tags: string[];
};

export async function getRecentAccessMetadata() {
  // 1. Categories 가져오기
  const { data: categoriesData, error: categoriesError } = await supabase
    .from("categories")
    .select("name, slug")
    .order("name");

  if (categoriesError) {
    console.error("Error fetching categories:", categoriesError);
  }

  // 2. Projects with their categories and tags
  const { data: projectsData, error: projectsError } = await supabase
    .from("projects")
    .select(`
      name,
      slug,
      description,
      project_categories (
        category_slug
      ),
      project_tags (
        tag_slug
      )
    `)
    .order("name");

  if (projectsError) {
    console.error("Error fetching projects:", projectsError);
  }

  // 3. Projects 데이터 구조 변환
  const formattedProjects = (projectsData || []).map(project => ({
    name: project.name,
    slug: project.slug,
    description: project.description,
    categories: project.project_categories?.map((pc: any) => pc.category_slug) || [],
    tags: project.project_tags?.map((pt: any) => pt.tag_slug) || []
  }));

  // 4. Tags 가져오기 - FIXED: removed "as group"
  const { data: tagsData, error: tagsError } = await supabase
    .from("tags")
    .select("name, slug, group_name")
    .order("name");

  if (tagsError) {
    console.error("Error fetching tags:", tagsError);
  }

  // 5. 최근 사용된 slug 순서 가져오기
  const { data: postsData, error: postsError } = await supabase
    .from("posts")
    .select(`
      category_slugs,
      project_slugs,
      tag_slugs,
      updated_at
    `)
    .order("updated_at", {
      ascending: false,
    });

  if (postsError || !postsData) {
    console.error("Error fetching posts for priority:", postsError);
    
    // Map group_name to group for consistency
    const mappedTags = (tagsData || []).map(tag => ({
      ...tag,
      group: tag.group_name
    }));
    
    return {
      categories: categoriesData || [],
      projects: formattedProjects,
      tags: mappedTags,
    };
  }

  // 6. 최근 사용된 slug 순서 추출
  const recentCategoryOrder = Array.from(
    new Set(
      postsData.flatMap((post) => post.category_slugs || [])
    )
  );

  const recentProjectOrder = Array.from(
    new Set(
      postsData.flatMap((post) => post.project_slugs || [])
    )
  );

  const recentTagOrder = Array.from(
    new Set(
      postsData.flatMap((post) => post.tag_slugs || [])
    )
  );

  // 7. 우선순위 맵 생성
  const createPriorityMap = (slugs: string[]) => {
    const map = new Map<string, number>();
    slugs.forEach((slug, index) => {
      map.set(slug, index);
    });
    return map;
  };

  const categoryPriorityMap = createPriorityMap(recentCategoryOrder);
  const projectPriorityMap = createPriorityMap(recentProjectOrder);
  const tagPriorityMap = createPriorityMap(recentTagOrder);

  // 8. 우선순위 정렬 함수
  const prioritySort = <T extends { slug: string }>(
    items: T[],
    priorityMap: Map<string, number>
  ) => {
    return [...items].sort((a, b) => {
      const aPriority = priorityMap.get(a.slug) ?? Number.MAX_SAFE_INTEGER;
      const bPriority = priorityMap.get(b.slug) ?? Number.MAX_SAFE_INTEGER;
      return aPriority - bPriority;
    });
  };

  // 9. Map group_name to group for consistency
  const mappedTags = (tagsData || []).map(tag => ({
    name: tag.name,
    slug: tag.slug,
    group: tag.group_name || undefined
  }));

  // 10. 결과 반환
  return {
    categories: prioritySort(
      categoriesData || [],
      categoryPriorityMap
    ),
    projects: prioritySort(
      formattedProjects,
      projectPriorityMap
    ),
    tags: prioritySort(
      mappedTags,
      tagPriorityMap
    ),
  };
}
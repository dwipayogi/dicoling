import translations from "@/constants/Translations";
import type { Language } from "@/contexts/LanguageContext";

export type ResolvedCategory = {
	id: string;
	key: string;
	title: string;
	isFallback: boolean;
};

const FALLBACK_CATEGORY_KEY = "Fonologi";
const FALLBACK_CATEGORY_ID =
	translations.ID.home.categories.find(
		(category) => category.title === FALLBACK_CATEGORY_KEY,
	)?.id ?? "1";

function slugifyCategoryTitle(title: string) {
	return title
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
}

function getCategoryKeyById(categoryId: string) {
	return (
		translations.ID.home.categories.find(
			(category) => category.id === categoryId,
		)?.title ?? FALLBACK_CATEGORY_KEY
	);
}

function getCategoryTitleById(categoryId: string, language: Language) {
	return (
		translations[language].home.categories.find(
			(category) => category.id === categoryId,
		)?.title ?? getCategoryKeyById(categoryId)
	);
}

function findCategoryIdBySlug(categorySlug: string) {
	const normalizedSlug = slugifyCategoryTitle(categorySlug);
	const languages = Object.keys(translations) as Language[];

	for (const language of languages) {
		const matched = translations[language].home.categories.find(
			(category) => slugifyCategoryTitle(category.title) === normalizedSlug,
		);

		if (matched) {
			return matched.id;
		}
	}

	return undefined;
}

export function getCategorySlug(title: string) {
	return slugifyCategoryTitle(title);
}

export function resolveCategoryFromSlug(
	categorySlug: string | undefined,
	language: Language,
): ResolvedCategory {
	const requestedId = categorySlug
		? findCategoryIdBySlug(categorySlug)
		: undefined;
	const resolvedId = requestedId ?? FALLBACK_CATEGORY_ID;
	const resolvedKey = getCategoryKeyById(resolvedId);
	const resolvedTitle = getCategoryTitleById(resolvedId, language);

	return {
		id: resolvedId,
		key: resolvedKey,
		title: resolvedTitle,
		isFallback: resolvedId !== requestedId,
	};
}

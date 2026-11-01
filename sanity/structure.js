import {PRIVATE_TYPES} from './privateIds'

/**
 * Struktura Studio taka jak domyślna. Zamówienia i użytkownicy mają ukryte ID "private.<typ>.<id>"
 * (niedostępne publicznie) i tworzone są wyłącznie przez stronę – w Studio nie ma dla nich przycisku "Create".
 */
export const structure = (S) =>
    S.list()
        .title('Content')
        .items(
            S.documentTypeListItems().map((item) => {
                const type = item.getId()
                if (!PRIVATE_TYPES.includes(type)) return item

                return item.child(
                    S.documentTypeList(type)
                        .title(item.getTitle())
                        .initialValueTemplates([])
                        .menuItems([])
                )
            })
        )

// Ukrywa typy prywatne w globalnym przycisku "Create" (tworzyłby publiczne ID)
export const newDocumentOptions = (prev) =>
    prev.filter((template) => !PRIVATE_TYPES.includes(template.templateId))

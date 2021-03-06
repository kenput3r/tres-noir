const path = require("path")

exports.createPages = async ({ graphql, actions: { createPage } }) => {
  const pageable = await graphql(`
    query PagesQuery {
      allShopifyProduct {
        edges {
          node {
            handle
            id
            metafields {
              key
              value
            }
            productType
          }
        }
      }
      allShopifyCollection {
        edges {
          node {
            handle
            id
          }
        }
      }
      allContentfulProduct {
        edges {
          node {
            handle
          }
        }
      }
    }
  `)

  pageable.data.allShopifyProduct.edges.forEach(
    async ({ node: { handle, id, metafields, productType } }) => {
      let template = "product"
      if (metafields.length) {
        metafields.forEach(node => {
          if (node.key === "gatsby_template_name" && node.value) {
            template = node.value
          }
        })
      }

      if (productType === "Glasses") {
        template = "product-customizable"
      }

      if (
        productType !== "Lense Customization" &&
        productType !== "Lens Customization"
      ) {
        createPage({
          path: `/products/${handle}`,
          component: path.resolve(`./src/templates/${template}.tsx`),
          context: {
            id,
            handle,
          },
        })
      }
    }
  )
  pageable.data.allShopifyProduct.edges.forEach(
    async ({ node: { handle, id, productType } }) => {
      if (
        productType === "Glasses"
      ) {
        createPage({
          path: `/products/${handle}/customize`,
          component: path.resolve(`./src/templates/customize.tsx`),
          context: {
            id,
            handle,
          },
        })
      }
    }
  )
  pageable.data.allShopifyCollection.edges.forEach(
    ({ node: { handle, id } }) => {
      const template = "collection"
      createPage({
        path: `/collections/${handle}`,
        component: path.resolve(`./src/templates/${template}.tsx`),
        context: {
          id,
          handle,
        },
      })
    }
  )
  pageable.data.allContentfulProduct.edges.forEach(
    ({ node: { handle }}) => {
      createPage({
        path: `/${handle}`,
        component: path.resolve(`./src/templates/learn-more/index.tsx`),
        context: {
          handle,
        },
      })
    }
  )
}

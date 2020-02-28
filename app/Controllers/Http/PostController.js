'use strict'

const {validate} = use('Validator')
const Post = use('App/Models/Post')

class PostController {

  async index({ response }) {
    response.json(await Post.all())
  }

  async show({ params, response }) {
    const id = Number(params.id)
    const post = await Post.find(id)

    if (!post) {
      response.notFound({
        error: 'Not Found'
      })
      return
    }
    response.json(post)
  }

  async store({ request, response }) {
    // recebe os dados do novo post
    //criar um objeto

    const newPostData = request.only(['author', 'title', 'text'])

    //valida o novo post
    const rules = {
      author: 'required|string',
      title: 'required|string',
      text: 'string'
    }

    const validation = await validate(newPostData, rules)

    if(validation.fails()) {
      response.badRequest(validation.messages())
      return
    }

    const post = await Post.create(newPostData)

    //retornar o novo post
    response.json(post)
  }

  async update ({params, request, response}) {
    //pegar o id da URL
    const id = Number(params.id)
    //pegar a postagem do ID tal
    const post = await Post.find(id)

    if(!post) {
      response.notFound()({
        error:'Not Found'
      })
      return
    }

    //pegar os dados novos
    const updates = request.only(['title', 'text'])
    //atualizar a póstagem
    const newPost = {
      ...post,
      ...updates
      /* os 3 pontos antes e ele sobrepoe o que havia antes.*/
    }

    //valida o post atualizado
    const rules = {
      title: 'string',
      text: 'string'
    }

    const validation = await validate(newPost, rules)

    if(validation.fails()) {
      response.badRequest(validation.messages())
      return
    }

    post.merge(updates)
    await post.save()

    //retorna a postagem já atualizada
    response.json(post)
  }

  async destroy({ params, response }) {
    // pegar o ido URL
    const id = Number(params.id)
    // encontrar a postagem
    const post = await Post.find(id)

    if(!post) {
      response.notFound({
        error: 'Not Found'
      })
      return
    }
    //deletar postagem
    await post.delete()
    //retornar nada com codigo no content
    response.noContent({})
  }
}

module.exports = PostController

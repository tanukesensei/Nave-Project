'use strict'

class CommentController {


  async index({ response }) {
    response.json(await Comment.all())
  }

  async show({ params, response }) {
    const id = Number(params.id)
    const comment = await Comment.find(id)

    if (!comment) {
      response.notFound({
        error: 'Not Found'
      })
      return
    }
    response.json(comment)
  }

  async store({ request, response }) {
    // recebe os dados do novo comment
    //criar um objeto

    const newPostData = request.only(['title', 'description'])

    //valida o novo comment
    const rules = {
      title: 'required|string',
      description: 'string'
    }

    const validation = await validate(newPostData, rules)

    if(validation.fails()) {
      response.badRequest(validation.messages())
      return
    }

    const comment = new Comment()
    comment.title = newPostData.title
    comment.description = newPostData.description

    await comment.save()

    //retornar o novo comment
    response.json(comment)
  }

  async update ({params, request, response}) {
    //pegar o id da URL
    const id = Number(params.id)
    //pegar a postagem do ID tal
    const comment = await Comment.find(id)

    if(!comment) {
      response.notFound()({
        error:'Not Found'
      })
      return
    }

    //pegar os dados novos
    const updates = request.only(['title', 'description'])
    //atualizar a póstagem
    const newPost = {
      ...comment,
      ...updates
      /* os 3 pontos antes e ele sobrepoe o que havia antes.*/
    }

    //valida o comment atualizado
    const rules = {
      title: 'string',
      description: 'string'
    }

    const validation = await validate(newPost, rules)

    if(validation.fails()) {
      response.badRequest(validation.messages())
      return
    }

    comment.merge(update)
    await comment.save()

    //retorna a postagem já atualizada
    response.json(comment)
  }

  async destroy({ params, response }) {
    // pegar o ido URL
    const id = Number(number.id)
    // encontrar a postagem
    const comment = await Comment.find(id)

    if(!comment) {
      response.notFound({
        error: 'Not Found'
      })
      return
    }
    //deletar postagem
    await comment.delete()
    //retornar nada com codigo no content
    response.noContent({})
  }


}

module.exports = CommentController

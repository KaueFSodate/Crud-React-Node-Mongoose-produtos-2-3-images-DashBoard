import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Componentes
import Input from '../../form/Input'

// utils
import api from '../../../utils/api'

// Hooks
import useFlashMessage from '../../../hooks/useFlashMessage'


function CadastrarProdutos() {
  const [produto, setProduto] = useState({})
  const [preview, setPreview] = useState([])
  const [token] = useState(localStorage.getItem('token'))
  const navigate = useNavigate()

  // Usar as mensagens
  const {setFlashMessage} = useFlashMessage()

  // Pegar os valores dos inputs
  function handleFIleChange(e){
    console.log(Array.from(e.target.files))
    setPreview(Array.from(e.target.files))
    setProduto({ ...produto, imagens: [...e.target.files] })
  }

  // Pegar os valores dos inputs
  function handleChange(e) {
    setProduto({...produto, [e.target.name]: e.target.value})
  }

  // Função para cadastrar o produto
  async function handleSubmit(e){
    e.preventDefault()
    let msgType = 'success'
    
    const formData = new FormData()

    const produtoFormData = await Object.keys(produto).forEach((key) => {
      if (key === 'imagens') {
        for (let i = 0; i < produto[key].length; i++) {
          formData.append(`imagens`, produto[key][i])
        }
      } else {
        formData.append(key, produto[key])
      }
    })

    formData.append('produtos', produtoFormData)

    const data = await api
      .post(`produtos/cadastrar`, formData, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log(response.data)
        return response.data
      })
      .catch((err) => {
        console.log(err)
        msgType = 'error'
        return err.response.data
      })

    setFlashMessage(data.message, msgType)
    navigate('/produtos/meusprodutos')
    console.log(produto)

  }

  return (
            <section>
              <form onSubmit={handleSubmit}>
              <div>
                  {preview.length > 0
                    ? preview.map((image, index) => (
                        <img
                          src={URL.createObjectURL(image)}
                          alt={produto.nome}
                          key={`${produto.nome}+${index}`}
                        />
                      ))
                      : produto.imagens &&
                      produto.imagens.map((image, index) => (
                        <img
                          src={`${process.env.REACT_APP_API}/images/produtos/${image}`}
                          alt={produto.nome}
                          key={`${produto.nome}+${index}`}
                        />
                      ))}
                </div>
                <Input
                text="Imagem: "
                type="file"
                name="imagens"
                handleOnChange={handleFIleChange}
                multiple={true}
                />
                <Input
                text="Produto: "
                type="text"
                name="nome"
                placeholder="Digite o nome do produto"
                handleOnChange={handleChange}
                />
                <Input
                text="Descrição: "
                type="text"
                name="descricao"
                placeholder="Digite a descrição do produto"
                handleOnChange={handleChange}
                />
                <Input
                text="Valor: "
                type="number"
                name="valor"
                placeholder="Digite o valor do produto"
                handleOnChange={handleChange}
                />
                <button type="submit">Cadastrar produto</button>
              </form>
            </section>
  )
}

export default CadastrarProdutos
import React from 'react'
import {useState, useContext} from 'react'
import {Context} from '../../Context/Context'
import api from '../../services/api'
import upload from '../../services/upload'
import './UserSetting.css'

async function postImage({image, description}) {
    const formData = new FormData();
    formData.append("image", image)
    formData.append("description", description)
  
    const result = await upload.post('/images', formData, { headers: {'Content-Type': 'multipart/form-data'}})
    return result.data
  }

export default function UserSetting() {
    const [photo, setPhoto]= useState(null)
    const [name, setName]= useState(" ")
    const [email, setEmail]= useState(" ")
    const [whatsapp, setWhatsapp]= useState(" ")

    const { user } = useContext(Context)
    const {isFetching, dispatch } = useContext(Context)

    const Update = async (e)=>{
        e.preventDefault()
        dispatch({ type: "UPDATE_START"})
        const newPost = {
            username: name,
            whatsapp: whatsapp,
            email: email,
            userId: user._id,
          };
          if(photo){
            try{
              const description = Date.now() + photo.name;
              const result = await postImage({image: photo, description})
              newPost.profilePic = result.imagePath.split("/")[2];
            }catch(err){}
          }
          try{
            const userUpdate = await api.put(`/users/${user._id}`, newPost)
            await dispatch({ type: "UPDATE_SUCCESS", payload: userUpdate.data.updateUser})
            console.log(userUpdate.data.updateUser)
          }catch(err){
            dispatch({ type: "UPDATE_FAILURE"})
            alert(err)
          }
    }

  return (
    <form className='fullContenUser' onSubmit={Update}>
            <h4 className="userInfo">Meus dados de Usuário...</h4>
            <div className="dados">
                <div className=" use imgUser">
                    <i className="Iselect photoUser">Foto de Perfil</i>
                    {photo ? (
                        <img src={URL.createObjectURL(photo)} alt=' ' className='borderImg' />
                    ):(
                        <img 
                        src="https://cdn-icons-png.flaticon.com/512/47/47774.png" 
                        alt="" className="borderImg" />
                    )}
                    <label for='imgUserPhoto' className="bolinha">
                        <i className="fa-solid fa-pen iconColor"></i>
                    </label>
                </div>
                <div className="expretionData">
                    <div className=" use userNameUser">
                        <i className="Iselect userNameOfUser">Nome de Usuário</i>
                        <input type="text" className="userInputB Bselect inputbBortder" placeholder="Mariano António Vunge Peralta New" onChange={(e)=> setName(e.target.value)} />
                    </div>
                    <div className=" use zapUser">
                        <i className="Iselect zapUserI">Whatsapp...</i>
                        <input type="text" className="userInputB Bselect inputbBortder" placeholder="(85)991392625" onChange={(e)=> setWhatsapp(e.target.value)} />
                    </div>
                    <div className=" use e-mailUser">
                        <i className="Iselect EmailUserI">E-mail...</i>
                        <input type="text" className="userInputB Bselect inputbBortder" placeholder="vungemariano@gmail.com" onChange={(e)=> setEmail(e.target.value)} />
                    </div>
                    <div className=" use e-mailUser displayNone">
                        <i className="Iselect EmailUserI displayNone">Imagem de Perfil...</i>
                        <input type="file" id='imgUserPhoto' accept="image/*" className="inputImgUser userInputB Bselect displayNone" onChange={(e)=> setPhoto(e.target.files[0])} />
                    </div>
                    <div className=" use e-mailUser">
                        <button type='submit' disabled={isFetching} className="entrarbutton inputImgUser userInputB Bselect ButtonBackgrondcolor">Salvar Alteração</button>
                    </div>
                </div>
            </div>
        </form>
  )
}
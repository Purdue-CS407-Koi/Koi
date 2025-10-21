// TODO: change logo to profile picture placeholder
// Profile picture is not part of sprint 2, we can use a person-like placeholder
// like how Windows does it
import logo from "@/assets/logo.png";

const Profile = () => {
  return (
    <div className="cursor-pointer">
      <img className="inline w-9 h-9 rounded-full bg-white" src={logo} alt="Profile picture of user"/>
    </div>
  )
  
}

export default Profile;
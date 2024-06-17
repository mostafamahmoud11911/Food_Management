import logo from "../../../../assets/images/noData.svg";

export default function DeleteItem({type}) {

  return (
    <div className="text-center">
      <img src={logo} className="w-50" alt="" />
      <h5 className="my-3">Delete This {type} ?</h5>
      <p>are you sure you want to delete this item ? if you are sure just click on delete it</p>
    </div>
  )
}

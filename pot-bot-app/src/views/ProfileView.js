function ProfileView(handleNotificationToggle) {
  return (
    <div>
      {/* <div className={"row"}>
                <label htmlFor="notificationToggle">Receive notifications</label>
                <input
                type="checkbox"
                id="notificationToggle"
                onChange={handleNotificationToggle}
                />
            </div> */}
      {/* Some suggestions for what to include in the profile */}
      <div className={"row"}>
        <p>Change your password</p>
      </div>
      <div className={"row"}>
        <p>Change your E-mail</p>
      </div>
      <div className={"row"}>
        <p>De-activate your account</p>
      </div>
    </div>
  )
}

export default ProfileView;

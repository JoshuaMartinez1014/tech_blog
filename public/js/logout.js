const logout = async function () {
  const response = await fetch("/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    document.location.replace("/");
  } else {
    alert("Failed to log out");
  }
};

document.querySelector("#logout-link").addEventListener("click", logout);

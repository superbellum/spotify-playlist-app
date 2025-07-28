import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/useAuth";
import {Button} from "primereact/button";
import {useState} from "react";
import {SelectButton} from "primereact/selectbutton";
import {InputText} from "primereact/inputtext";

export default function Home() {
  const navigate = useNavigate();
  const {accessToken, logout} = useAuth();
  const workoutIntensityOptions = ["High", "Medium", "Low"];
  const [workoutIntensity, setWorkoutIntensity] = useState(workoutIntensityOptions[0]);
  const [workoutDuration, setWorkoutDuration] = useState("60");
  const tempoMap = {
    Low: {min: 0, max: 80},
    Medium: {min: 81, max: 120},
    High: {min: 121, max: 200},
  };

  function handleLogout() {
    logout();
    navigate("/login");
  }

  async function generatePlaylist() {
    const {min, max} = tempoMap[workoutIntensity];
    const seedGenres = ["house", "dance", "edm"];
    const songCount = 10;

    const res = await fetch(
      `https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Spotify API error: ${res.status} – ${errorText}`);
    }

    const data = await res.json();
    const tracks = data.tracks;
    console.log(tracks);
  }

  return (
    <>
      {accessToken && (
        <div className="text-center">
          <div className="flex justify-content-center gap-3 mb-5">
            <h2 className="m-0">Spotify workout playlist app</h2>
            <Button label="Logout" onClick={handleLogout}/>
          </div>

          <p>Select Workout Intensity:</p>
          <SelectButton
            value={workoutIntensity}
            onChange={(e) => setWorkoutIntensity(e.value)}
            options={workoutIntensityOptions}
          />

          <div>
            <p>Enter Workout Duration</p>
            <InputText
              className="w-5rem"
              type="number"
              min="0"
              keyfilter="int"
              value={workoutDuration}
              onChange={(e) => setWorkoutDuration(e.target.value)}
            />
            <span className="ml-2">minutes</span>
          </div>

          <Button className="mt-5" label="Generate Playlist" onClick={generatePlaylist}/>


        </div>
      )}
    </>
  )
}

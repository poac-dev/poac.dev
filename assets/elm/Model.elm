module Model exposing (..)

import Routing exposing (Route)
import Http exposing (Request)


type RemoteData e a
    = NotRequested
    | Requesting
    | Failure e
    | Success a


type alias UserInfo =
    { name : String
    , imgUrl : String
    , usrId : String -- TODO: userId
    }

type alias Model =
    { route : Route
    , userInfo : RemoteData String UserInfo
    , search : String
    , csrfToken : String
    }


initialModel : Route -> Model
initialModel route =
    { route = route
    , userInfo = NotRequested
    , search = ""
    , csrfToken = ""
    }

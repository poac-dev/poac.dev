module Routing exposing (..)

import Navigation
import UrlParser exposing (..)


type Route
    = HomeIndexRoute
    | PackagesRoute
    | DonateRoute
    | UsersRoute String
    | SettingsRoute
    | NotFoundRoute


-- toPath is unnecessary?
toPath : Route -> String
toPath route =
    case route of
        HomeIndexRoute ->
            "/"

        PackagesRoute ->
            "/packages"

        DonateRoute ->
            "/donate"

        UsersRoute userId ->
            "/users/" ++ userId

        SettingsRoute ->
            "/settings"

        NotFoundRoute ->
            "/not-found"


matchers : Parser (Route -> a) a
matchers =
    oneOf
        [ map HomeIndexRoute top
        , map PackagesRoute <| s "packages"
        , map DonateRoute <| s "donate"
        , map UsersRoute <| s "users" </> string
        , map SettingsRoute <| s "settings"
        ]


parse : Navigation.Location -> Route
parse location =
    case UrlParser.parsePath matchers location of
        Just route ->
            route

        Nothing ->
            NotFoundRoute

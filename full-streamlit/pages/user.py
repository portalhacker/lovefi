import streamlit as st

from services.database_service import DatabaseService

COUNTRIES = [
    {"code": "CA", "name": "Canada"},
    {"code": "FR", "name": "France"},
    {"code": "US", "name": "United States"},
    {"code": "Other", "name": "Other"},
]

STATES = {
    "CA": [
        {"code": "AB", "name": "Alberta"},
        {"code": "BC", "name": "British Columbia"},
        {"code": "MB", "name": "Manitoba"},
        {"code": "NB", "name": "New Brunswick"},
        {"code": "NL", "name": "Newfoundland and Labrador"},
        {"code": "NS", "name": "Nova Scotia"},
        {"code": "NT", "name": "Northwest Territories"},
        {"code": "NU", "name": "Nunavut"},
        {"code": "ON", "name": "Ontario"},
        {"code": "PE", "name": "Prince Edward Island"},
        {"code": "QC", "name": "Quebec"},
        {"code": "SK", "name": "Saskatchewan"},
        {"code": "YT", "name": "Yukon"},
    ],
    "US": [
        {"code": "AL", "name": "Alabama"},
        {"code": "AK", "name": "Alaska"},
        {"code": "AZ", "name": "Arizona"},
        {"code": "AR", "name": "Arkansas"},
    ],
}

st.title("LoveFI")
st.header("User")

with st.form("user_form"):
    user = {
        "email": st.text_input(label="Email", value="", key="user_email_input"),
        "password": st.text_input(label="Password", value="", type="password", key="user_password_input"),
        "first_name": st.text_input(label="First name", value="", key="user_first_name_input"),
        "last_name": st.text_input(label="Last name", value="", key="user_last_name_input"),
        "country": st.selectbox(label="Country",options=[country["code"] for country in COUNTRIES], key="user_country_input"),
        "state": None,
    }
    if user["country"] in STATES: 
        user["state"] = st.selectbox(label="State",options=[state["code"] for state in STATES[user["country"]]], key="user_state_input")
    submitted = st.form_submit_button(label="Submit")
    if submitted:
        st.write(f"Hello {user['first_name']}")
        st.write(f"Sending user data to API")
        st.write(DatabaseService().get_all_users())

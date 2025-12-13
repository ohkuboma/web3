import streamlit as st
from datetime import datetime, timedelta

st.title("試験まであと何日？")

# 🔹 名前を入力してもらう
name = st.text_input("あなたのお名前を教えてください", placeholder="マリちゃん")

# 🔹 試験日を選んでもらう
default_date = datetime.now().date() + timedelta(days=7)
exam_date = st.date_input("試験日を選んでください", value=default_date, min_value=datetime.now().date())

today = datetime.now().date()
days_left = (exam_date - today).days

# 🔹 名前が入力されたらメッセージ表示
if name:
    if days_left > 30:
        st.success(f"まだ時間はあるよ、{name}！コツコツ積み重ねが力になるぞい。")
    elif 10 < days_left <= 30:
        st.info(f"いよいよ本腰入れる時期だな、{name}！焦らず、でも確実に行こうや。")
    elif 1 < days_left <= 10:
        st.warning(f"もうひと踏ん張りだ、{name}！一日一日を大切にな。")
    elif days_left == 1:
        st.warning(f"いよいよ明日か…やれることはやった、{name}！あとは信じるだけだな。")
    elif days_left == 0:
        st.error(f"本番だ！深呼吸して、{name}らしく行ってこい！")
    else:
        st.balloons()
        st.write(f"試験は終わったかな、{name}？おつかれさま！よく頑張ったな〜。")
else:
    st.info("名前を入力してくれたら、トラちゃんの応援が届くよ〜😊")

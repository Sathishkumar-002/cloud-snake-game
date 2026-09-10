from flask import Flask, request, jsonify
from flask_cors import CORS

import boto3

app = Flask(__name__)

CORS(app)


# ==============================
# DYNAMODB CONNECTION
# ==============================

dynamodb = boto3.resource(
    "dynamodb",
    region_name="ap-south-1"
)

table = dynamodb.Table(
    "SnakeGameScores"
)


# ==============================
# TEST API
# ==============================

@app.route(
    "/api/message",
    methods=["GET"]
)
def message():

    return jsonify({
        "message":
        "Snake Flask API Connected!"
    })


# ==============================
# SAVE SCORE
# ==============================

@app.route(
    "/api/score",
    methods=["POST"]
)
def save_score():

    try:

        data = request.get_json()

        player = data.get("player")

        score = data.get("score")


        if not player:

            return jsonify({
                "error":
                "Player name is required"
            }), 400


        if score is None:

            return jsonify({
                "error":
                "Score is required"
            }), 400


        # Generate unique ID internally
        # for DynamoDB partition key

        game_id = str(
            boto3.client("dynamodb")
        )


        table.put_item(

            Item={

                "game_id":
                    str(id(data)),

                "player":
                    player,

                "score":
                    int(score)

            }

        )


        return jsonify({

            "message":
            "Score saved successfully!",

            "player":
                player,

            "score":
                int(score)

        })


    except Exception as e:

        print(e)

        return jsonify({

            "error":
                str(e)

        }), 500


# ==============================
# GET LEADERBOARD
# ==============================

@app.route(
    "/api/scores",
    methods=["GET"]
)
def get_scores():

    try:

        response =
            table.scan()

        scores =
            response.get(
                "Items",
                []
            )


        scores.sort(

            key=lambda x:
                int(x.get(
                    "score",
                    0
                )),

            reverse=True

        )


        return jsonify(
            scores[:10]
        )


    except Exception as e:

        print(e)

        return jsonify({

            "error":
                str(e)

        }), 500


# ==============================
# RUN FLASK
# ==============================

if __name__ == "__main__":

    app.run(

        host="0.0.0.0",

        port=5000

    )

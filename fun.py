"""A fun little module with a compliment generator."""

import random


def generate_compliment() -> str:
    """Generate a random compliment to brighten someone's day."""
    adjectives = [
        "amazing", "brilliant", "fantastic", "wonderful",
        "incredible", "outstanding", "magnificent", "stellar"
    ]

    nouns = [
        "human", "developer", "problem-solver", "thinker",
        "creator", "innovator", "team player", "friend"
    ]

    endings = [
        "Keep being awesome!",
        "The world is better with you in it!",
        "You're doing great!",
        "Never stop being you!",
        "Your potential is limitless!"
    ]

    adjective = random.choice(adjectives)
    noun = random.choice(nouns)
    ending = random.choice(endings)

    return f"You are an {adjective} {noun}. {ending}"


if __name__ == "__main__":
    print(generate_compliment())

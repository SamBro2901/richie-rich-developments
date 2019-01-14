const mongoose = require('mongoose');

const moneySchema = mongoose.Schema({
    userID: String,
    pickaxe: Number,
    durability: Number,
    level: Number,
    xp: Number,
    money: Number,
    lootchest: Number,
    stone: Number,
    coal: Number,
    iron: Number,
    gold: Number,
    redstone: Number,
    lapis: Number,
    diamond: Number,
    emerald: Number,
    eff: Number,
    fortune: Number,
    unbreaking: Number

})

module.exports = mongoose.model("Money", moneySchema);
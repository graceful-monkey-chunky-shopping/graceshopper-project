const router = require('express').Router()
const { models: { User, Cart }} = require('../db')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and username fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ['id', 'username']
    })
    res.json(users)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id)
    res.send(user)
  } catch (e) {
    next(e)
  }
})

router.post ('/create', async (req, res, next) => {
  try {
    res.send(await User.create(req.body))
  } catch (e) {
    next (e)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const updateUser = await User.findByPk(req.params.id);
    res.send(await updateUser.update(req.body))
  } catch(e) {
    next(e)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user.isAdmin === true) {
      await user.destroy();
      res.send(user)
    } else {
      res.send("Nice try, maybe next time")
    }
  } catch (error) {
    next(error)
  }
})

router.get('/:id/cart', async (req, res, next) => {
  try {
    const carts = await Cart.findAll({
      include: {
        where: {
          userId: req.params.id
        }
      }
    });
    res.send(carts);
  } catch (error) {
    next(error)
  }
})
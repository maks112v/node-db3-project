const db = require('../../data/db-config');
const yup = require('yup');

/*
  If `scheme_id` does not exist in the database:

  status 404
  {
    "message": "scheme with scheme_id <actual id> not found"
  }
*/
const checkSchemeId = async (req, res, next) => {
  const scheme = await db('schemes')
    .where('scheme_id', req.params.scheme_id)
    .first();

  if (!scheme) {
    res.status(404).json({
      message: `scheme with scheme_id ${req.params.scheme_id} not found`,
    });
  } else {
    next();
  }
};

/*
  If `scheme_name` is missing, empty string or not a string:

  status 400
  {
    "message": "invalid scheme_name"
  }
*/
const validateScheme = (req, res, next) => {
  if (yup.string().required().isValidSync(req.body.scheme_name) && typeof req.body.scheme_name !== 'number') {
    next();
  } else {
    res.status(400).json({ message: 'invalid scheme_name' });
  }
};

/*
  If `instructions` is missing, empty string or not a string, or
  if `step_number` is not a number or is smaller than one:

  status 400
  {
    "message": "invalid step"
  }
*/
const validateStep = (req, res, next) => {
  yup
    .object()
    .shape({
      instructions: yup.string().required(),
      step_number: yup.number().min(1).required(),
    })
    .validate(req.body, { abortEarly: false })
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(400).json({ message: 'invalid step' });
    });
};

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
};

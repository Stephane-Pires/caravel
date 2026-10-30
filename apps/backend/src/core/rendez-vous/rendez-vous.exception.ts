import { DomainException } from "../../utils/exception.js"

export class RendezVousNotFoundException extends DomainException {
  readonly code = "1001"
  readonly description = "Rendez-vous not found"

  constructor() {
    super("Rendez-vous not found")
  }
}

export class RendezVousInvalidScheduleAtException extends DomainException {
  readonly code = "1002"
  readonly description = "Rendez-vous scheduled at an invalid time slot"

  constructor() {
    super("Rendez-vous scheduled at an invalid datetime")
  }
}

export class RendezVousInvalidScheduleAtAlreadyTakenException extends DomainException {
  readonly code = "1003"
  readonly description = "Rendez-vous scheduled at an already taken time slot"

  constructor() {
    super("Rendez-vous scheduled at an already taken time slot")
  }
}

export class RendezVousTooManyException extends DomainException {
  readonly code = "1004"
  readonly description =
    "This email already has the maximum of upcoming rendez-vous"

  constructor() {
    super("This email already has the maximum of upcoming rendez-vous")
  }
}

export class RendezVousSpamCheckFailedException extends DomainException {
  readonly code = "1005"
  readonly description = "The anti-spam check failed"

  constructor() {
    super("The anti-spam check failed, please try again")
  }
}

export class RendezVousOutsideAvailabilityException extends DomainException {
  readonly code = "1006"
  readonly description = "Rendez-vous outside the offered slots"

  constructor() {
    super("This time isn't one of the offered slots")
  }
}

// export function mapRendezVousException(exception: DatabaseException) {
//   // extract PostgreSQL error code
//   // extract PostgreSQL database contraint name

//   if (exception.cause && exception.cause.code === "23505") {
//     switch (exception.cause.constraint) {
//       case "rendez_vous_scheduledAt_unique":
//         return new RendezVousInvalidScheduleAtAlreadyTakenException()
//     }
//   }

//   return exception
// }

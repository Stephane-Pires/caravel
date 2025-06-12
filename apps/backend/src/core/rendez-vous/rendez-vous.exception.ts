import { DomainException } from "../../utils/exception.js"

export class RendezVousIdParamException extends DomainException {
  readonly code = "1000"
  readonly description =
    "Exception returned when the rendez-vous ID is invalid."

  constructor() {
    super("Invalid rendez-vous ID")
  }
}

export class RendezVousNotFoundException extends DomainException {
  readonly code = "1001"
  readonly description = "Exception returned when the rendez-vous is not found"

  constructor() {
    super("Rendez-vous not found")
  }
}

export class RendezVousInvalidScheduleAtException extends DomainException {
  readonly code = "1002"
  readonly description =
    "Exception returned when the rendez-vous is scheduled at an invalid date"

  constructor() {
    super("Rendez-vous scheduled at is invalid")
  }
}

export class RendezVousInvalidScheduleAtAlreadyTakenException extends DomainException {
  readonly code = "1003"
  readonly description =
    "Exception returned when the rendez-vous is scheduled at a date that is already taken"

  constructor() {
    super("The time slot is already booked")
  }
}

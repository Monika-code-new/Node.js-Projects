"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findDestinationContact = void 0;
const Client_1 = require("../Prisma/Client");
const findDestinationContact = async (destinationId, visited = new Set()) => {
    if (visited.has(destinationId)) {
        return null;
    }
    visited.add(destinationId);
    const destination = await Client_1.prisma.destination.findUnique({
        where: { id: destinationId },
        select: {
            metadata: true,
            parentId: true
        }
    });
    if (!destination)
        return null;
    const contact = typeof destination.metadata === 'object' &&
        destination.metadata !== null &&
        'contact' in destination.metadata
        ? destination.metadata.contact
        : null;
    if (contact) {
        return contact;
    }
    if (!destination.parentId) {
        return null;
    }
    return (0, exports.findDestinationContact)(destination.parentId, visited);
};
exports.findDestinationContact = findDestinationContact;

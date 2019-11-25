export const getManyUsers = async (ids) => {
    const USERS = {
        1: { name: "foo" },
        2: { name: "bar" }
    };
    
    return ids.map( id => USERS[id] || null);
};
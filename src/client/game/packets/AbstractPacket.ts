abstract class AbstractPacket<T> {

    public readonly id : string;
    public data : T;

    protected constructor(id : string, data? : T) {
        this.id = id;
        this.data = data;
    }

}

export default AbstractPacket;
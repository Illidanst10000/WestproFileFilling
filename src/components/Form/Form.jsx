import React, {useCallback, useEffect, useState} from 'react';
import './Form.css'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {useTelegram} from "../hooks/useTelegram";
const Form = () => {

    const [project, setProject] = useState('');
    const [hours, setHours] = useState('');
    const [date, setDate] = useState(new Date());
    const [location, setLocation] = useState('');
    const [cleanup, setCleanup] = useState(true);
    const [growth, setGrowth] = useState(false);
    const [mowing, setMowing] = useState(false);
    const [mechanical, setMechanical] = useState(false);
    const [aerification, setAerification] = useState(false);
    const [blowing, setBlowing] = useState(true);
    const [fertilization, setFertilization] = useState(false);
    const [liming, setLiming] = useState(false);
    const [weeding1, setWeeding1] = useState(false);
    const [weeding2, setWeeding2] = useState(true);
    const [weeding3, setWeeding3] = useState(false);
    const [weeding4, setWeeding4] = useState(false);
    const [extra, setExtra] = useState('');
    const [comments1, setComments1] = useState('');
    const [comments2, setComments2] = useState('');
    const [signature, setSignature] = useState('NB');

    const {tg} = useTelegram();
    const onSendData = useCallback(() => {
        const data = {
            project, hours, date, location,
            cleanup, growth, mowing, mechanical, aerification, blowing, fertilization,
            liming, weeding1, weeding2, weeding3, weeding4,
            extra, comments1, comments2, signature
        }
        tg.sendData(JSON.stringify(data))

    }, [project, hours, date, location,
        cleanup, growth, mowing, mechanical, aerification, blowing, fertilization,
        liming, weeding1, weeding2, weeding3, weeding4,
        extra, comments1, comments2, signature])

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData])

    useEffect(() => {
        tg.MainButton.setParams({
            text: 'Send'
        })
    }, [])

    useEffect(() => {
        if(!project || !date || !hours || !location || !signature) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        }
    }, [project, date, hours, location, signature])

    return (
        <div className={'form'}>
            <label>
                Project:
                <select value={project} onChange={(e) => setProject(e.target.value)}>
                    <option value="">Choose a project</option>
                    <option value="project1">Project 1</option>
                    <option value="project2">Project 2</option>
                    <option value="project3">Project 3</option>
                </select>
            </label>

            <label>
                Hours:
                <input type="text" value={hours} onChange={(e) => setHours(e.target.value)} />
            </label>

            <label>
                Date:
                <DatePicker selected={date} onChange={(d) => setDate(d)} />
            </label>

            <label>
                Location:
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
            </label>

            <label>
                <input type="checkbox" checked={cleanup} onChange={(e) => setCleanup(e.target.checked)} />
                Cleanup:
            </label>

            <label>
                <input type="checkbox" checked={growth} onChange={(e) => setGrowth(e.target.checked)} />
                Growth:
            </label>

            <label>
                <input type="checkbox" checked={mowing} onChange={(e) => setMowing(e.target.checked)} />
                Mowing:
            </label>

            <label>
                <input type="checkbox" checked={mechanical} onChange={(e) => setMechanical(e.target.checked)} />
                Mechanical:
            </label>

            <label>
                <input type="checkbox" checked={aerification} onChange={(e) => setAerification(e.target.checked)} />
                Aerification:
            </label>

            <label>
                <input type="checkbox" checked={blowing} onChange={(e) => setBlowing(e.target.checked)} />
                Blowing:
            </label>

            <label>
                <input type="checkbox" checked={fertilization} onChange={(e) => setFertilization(e.target.checked)} />
                Fertilization:
            </label>

            <label>
                <input type="checkbox" checked={liming} onChange={(e) => setLiming(e.target.checked)} />
                Liming:
            </label>

            <label>
                <input type="checkbox" checked={weeding1} onChange={(e) => setWeeding1(e.target.checked)} />
                Weeding 1:
            </label>

            <label>
                <input type="checkbox" checked={weeding2} onChange={(e) => setWeeding2(e.target.checked)} />
                Weeding 2:
            </label>

            <label>
                <input type="checkbox" checked={weeding3} onChange={(e) => setWeeding3(e.target.checked)} />
                Weeding 3:
            </label>

            <label>
                <input type="checkbox" checked={weeding4} onChange={(e) => setWeeding4(e.target.checked)} />
                Weeding 4:
            </label>

            <label>
                Extra:
                <input type="text" value={extra} onChange={(e) => setExtra(e.target.value)} />
            </label>

            <label>
                Comments 1:
                <input type="text" value={comments1} onChange={(e) => setComments1(e.target.value)} />
            </label>

            <label>
                Comments 2:
                <input type="text" value={comments2} onChange={(e) => setComments2(e.target.value)} />
            </label>

            <label>
                Signature:
                <input type="text" value={signature} onChange={(e) => setSignature(e.target.value)} />
            </label>
        </div>
    );
};

export default Form;